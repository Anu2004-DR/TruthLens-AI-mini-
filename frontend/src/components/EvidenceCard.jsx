import { motion } from "framer-motion";
import { FaFileAlt } from "react-icons/fa";

function EvidenceCard({ text, index }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-slate-900 rounded-2xl p-5 border border-slate-700 shadow-lg"
    >
      <div className="flex gap-4">

        <div className="text-cyan-400 text-xl mt-1">
          <FaFileAlt />
        </div>

        <div>

          <div className="font-bold text-cyan-300">
            Evidence #{index + 1}
          </div>

          <div className="text-gray-300 mt-2">
            {text}
          </div>

        </div>

      </div>
    </motion.div>
  );
}

export default EvidenceCard;