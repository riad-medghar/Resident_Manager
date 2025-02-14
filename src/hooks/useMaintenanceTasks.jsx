// hooks/useMaintenanceTasks.js
import { useState, useEffect, useCallback } from "react";
import pb from "../pocketsdk.js"; // Ensure this path is correct
import { format } from 'date-fns';

const useMaintenanceTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all maintenance tasks
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await pb.collection("maintenance_tasks").getList(1, 100);
      setTasks(response.items);
    } catch (err) {
      console.error("Error fetching maintenance tasks:", err);
      setError(err.message || "Failed to fetch maintenance tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new maintenance task
  const addTask = async (taskData) => {
    setLoading(true);
    setError(null);
    try {
      // Ensure dates are in ISO format
      if (taskData.expected_resolution) {
        taskData.expected_resolution = format(new Date(taskData.expected_resolution), 'yyyy-MM-dd');
      }
      const newTask = await pb.collection("maintenance_tasks").create(taskData);
      const fetchedTask = await pb.collection("maintenance_tasks").getOne(newTask.id, {
        expand: "assigned_to,unit",
      });
      setTasks((prev) => [fetchedTask, ...prev]);
      return fetchedTask;
    } catch (err) {
      console.error("Error adding maintenance task:", err);
      setError(err.message || "Failed to add maintenance task");
      throw err; // Allow external handling
    } finally {
      setLoading(false);
    }
  };

  // Update an existing maintenance task
  const updateTask = async (taskId, updatedData) => {
    setLoading(true);
    setError(null);
    try {
      if (updatedData.expected_resolution) {
        updatedData.expected_resolution = format(new Date(updatedData.expected_resolution), 'yyyy-MM-dd');
      }
      const updatedTask = await pb.collection("maintenance_tasks").update(taskId, updatedData);
      const fetchedTask = await pb.collection("maintenance_tasks").getOne(updatedTask.id, {
        expand: "assigned_to,unit",
      });
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? fetchedTask : task))
      );
      return fetchedTask;
    } catch (err) {
      console.error("Error updating maintenance task:", err);
      setError(err.message || "Failed to update maintenance task");
      throw err; // Allow external handling
    } finally {
      setLoading(false);
    }
  };

  // Delete a maintenance task
  const deleteTask = async (taskId) => {
    setLoading(true);
    setError(null);
    try {
      await pb.collection("maintenance_tasks").delete(taskId);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (err) {
      console.error("Error deleting maintenance task:", err);
      setError(err.message || "Failed to delete maintenance task");
      throw err; // Allow external handling
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
  };
};

export default useMaintenanceTasks;
