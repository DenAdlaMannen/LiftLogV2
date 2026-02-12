import React, { useRef } from 'react';
import { ArrowLeft, Download, Upload, Trash2, AlertTriangle } from 'lucide-react';

interface SettingsProps {
  onBack: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onBack }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = {
      workouts: localStorage.getItem('liftlog_workouts'),
      history: localStorage.getItem('liftlog_history'),
      weight: localStorage.getItem('liftlog_weight'),
      version: '1.0',
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `liftlog_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    if (window.confirm("This will OVERWRITE your current data with the backup file. Are you sure?")) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);

        // Basic validation
        if (!data.workouts && !data.history) {
          throw new Error("Invalid backup file format");
        }

        if (data.workouts) localStorage.setItem('liftlog_workouts', data.workouts);
        if (data.history) localStorage.setItem('liftlog_history', data.history);
        if (data.weight) localStorage.setItem('liftlog_weight', data.weight);

        alert("Data restored successfully! The app will now reload.");
        window.location.reload();
      } catch (err) {
        console.error(err);
        alert("Failed to restore data. Please check the file.");
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    if (window.confirm("WARNING: This will delete ALL your workouts and history from this device. This cannot be undone. Are you sure?")) {
      localStorage.removeItem('liftlog_workouts');
      localStorage.removeItem('liftlog_history');
      localStorage.removeItem('liftlog_weight');
      alert("All data cleared.");
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-slate-800 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-slate-400" />
        </button>
        <h2 className="text-2xl font-bold text-white">Settings</h2>
      </div>

      <div className="space-y-6">
        {/* DATA MANAGEMENT */}
        <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-emerald-400 mb-4 flex items-center gap-2">
            <Download className="w-5 h-5" />
            Data Backup
          </h3>
          <p className="text-slate-400 mb-6 text-sm leading-relaxed">
            Protect your progress. "Export" saves a file to your device. "Import" restores it.
            We recommend doing this weekly.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <button
              onClick={handleExport}
              className="flex items-center justify-center gap-3 bg-slate-800 hover:bg-slate-700 text-white p-4 rounded-xl border border-slate-700 transition-all active:scale-95"
            >
              <Download className="w-5 h-5 text-emerald-500" />
              <div className="text-left">
                <div className="font-semibold">Export Backup</div>
                <div className="text-xs text-slate-500">Save data to file</div>
              </div>
            </button>

            <button
              onClick={handleImportClick}
              className="flex items-center justify-center gap-3 bg-slate-800 hover:bg-slate-700 text-white p-4 rounded-xl border border-slate-700 transition-all active:scale-95"
            >
              <Upload className="w-5 h-5 text-blue-500" />
              <div className="text-left">
                <div className="font-semibold">Import Backup</div>
                <div className="text-xs text-slate-500">Restore from file</div>
              </div>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
          </div>
        </section>

        {/* DANGER ZONE */}
        <section className="bg-red-950/20 border border-red-900/30 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Danger Zone
          </h3>
          <p className="text-red-200/60 mb-6 text-sm leading-relaxed">
            This will wipe the app's internal storage. It does NOT delete your downloaded backup files.
          </p>

          <button
            onClick={handleClearData}
            className="w-full flex items-center justify-center gap-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 p-4 rounded-xl border border-red-900/50 transition-all active:scale-95"
          >
            <Trash2 className="w-5 h-5" />
            Factory Reset / Clear All Data
          </button>
        </section>

        {/* EXPERIMENTS */}
        <section className="bg-indigo-950/20 border border-indigo-900/30 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-indigo-400 mb-4 flex items-center gap-2">
            <span className="text-xl">🧪</span>
            Experimental Features
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-white">Smart Rest Timer</div>
              <div className="text-xs text-indigo-300/60">Estimate rest time by timing one set</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={localStorage.getItem('liftlog_settings')?.includes('"smartRestTimer":true') || false}
                onChange={(e) => {
                  const settings = { smartRestTimer: e.target.checked };
                  localStorage.setItem('liftlog_settings', JSON.stringify(settings));
                  // Force re-render not strictly needed as we just set localstorage, but good for UI feedback
                  window.location.reload();
                }}
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </section>

        <div className="text-center text-xs text-slate-600 mt-8">
          LiftLog v1.2.0 (Offline PWA)
        </div>
      </div>
    </div>
  );
};

export default Settings;
