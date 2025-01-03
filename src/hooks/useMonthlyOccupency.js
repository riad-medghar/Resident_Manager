// File: src/hooks/useMonthlyOccupancy.js
import { useState, useEffect, useCallback } from "react";
import pb from "../pocketsdk.js";

/**
 * Simple example of how to fetch allocations and compute a monthly occupancy array.
 * This is purely an example; adapt to your business logic.
 */
export default function useMonthlyOccupancy() {
  const [labels, setLabels] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // For demonstration, we assume "occupancy" is "number of active allocations".
  // Or you might combine with rooms to find "rooms actually occupied in each month".
  const fetchMonthlyOccupancy = useCallback(async () => {
    setLoading(true);
    try {
      // Expand so we have each allocation's room + resident if needed
      const res = await pb.collection("allocations").getFullList(200, {
        expand: "room_id,resident_id",
      });
      // We'll group them by "month" based on start_date or end_date logic
      const occupantCountPerMonth = computeActiveAllocationsByMonth(res);

      // occupantCountPerMonth might be an object like:
      //   { "2024-01": 4, "2024-02": 6, ... }
      // We'll transform that into two arrays for chart:
      const months = Object.keys(occupantCountPerMonth).sort(); 
      const counts = months.map((m) => occupantCountPerMonth[m]);

      setLabels(months); 
      setData(counts); 
    } catch (err) {
      setError(err.message || "Failed to compute monthly occupancy");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMonthlyOccupancy();
  }, [fetchMonthlyOccupancy]);

  return { labels, data, loading, error };
}

/**
 * Example helper to compute how many allocations were "active" in each month.
 * A simple approach: for each allocation, figure out all months from start to end,
 * then increment a counter for those months.
 */
function computeActiveAllocationsByMonth(allocations) {
  const monthlyCount = {};
  // We'll assume each allocation has start_date, end_date (YYYY-MM-DD).
  // If status="active", end_date might be null => treat as ongoing?

  allocations.forEach((alloc) => {
    if (!alloc.start_date) return; // no start date, skip
    const start = new Date(alloc.start_date);
    const end = alloc.end_date ? new Date(alloc.end_date) : new Date(); 
    // or pick some default for "active"?

    // We'll loop from start.month up to end.month
    // For a large date range, a more efficient approach might be needed
    let current = new Date(start.getFullYear(), start.getMonth(), 1);
    const last = new Date(end.getFullYear(), end.getMonth(), 1);

    while (current <= last) {
      const key = `${current.getFullYear()}-${String(
        current.getMonth() + 1
      ).padStart(2, "0")}`;
      monthlyCount[key] = (monthlyCount[key] || 0) + 1;
      // move to next month
      current.setMonth(current.getMonth() + 1);
    }
  });

  return monthlyCount;
}
