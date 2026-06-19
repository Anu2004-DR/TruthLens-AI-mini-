import { motion } from "framer-motion";

function Header() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-10"
    >
      <h1 className="text-6xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
        TruthLens AI
      </h1>

      <p className="text-gray-300 mt-4 text-lg">
        Explainable Fake News Detection using BERT + RAG
      </p>
    </motion.div>
  );
}

export default Header;