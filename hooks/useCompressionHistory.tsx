import { useRef } from "react";

import { type CompressionRecord, type Compression } from "./new/useCpr.types";

function useCompressionHistory() {
  const compressionHistory = useRef<Array<CompressionRecord>>([]);

  const recordCompressionHistory = (score: Compression, time: string): void => {
    const currentCompressionRecord: CompressionRecord = {
      score: score,
      time: time,
    };

    compressionHistory.current.push(currentCompressionRecord);
  };

  const clearCompressionHistory = (): void => {
    compressionHistory.current.length = 0;
  };

  return {
    recordCompressionHistory,
    clearCompressionHistory,
    compressionHistory,
  };
}

export default useCompressionHistory;
