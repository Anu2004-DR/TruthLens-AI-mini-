import { FaHistory } from "react-icons/fa";

function HistorySidebar({ history, onSelect }) {
  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-5 h-full">

      <div className="flex items-center gap-2 mb-5">
        <FaHistory className="text-cyan-400" />
        <h2 className="text-xl font-bold text-white">
          Recent Analyses
        </h2>
      </div>

      <div className="space-y-3">

        {history.length === 0 && (
          <p className="text-gray-400 text-sm">
            No previous searches.
          </p>
        )}

        {history.map((item, index) => (

          <div
            key={index}
            onClick={() => onSelect(item)}
            className="cursor-pointer rounded-xl bg-slate-800 p-3 hover:bg-slate-700 transition"
          >

            <p className="text-sm text-gray-200 line-clamp-2">
              {item.text}
            </p>

            <p className="text-xs text-cyan-400 mt-1">
              {item.prediction}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}

export default HistorySidebar;