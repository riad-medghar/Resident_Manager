import React, { useState } from 'react';
import useMaintenanceTasks from '../../hooks/useMaintenanceTasks';
import useFetchRooms from '../../hooks/useFetchRooms';
import { format } from 'date-fns';
import Modal from 'react-modal';
import { FaEdit, FaTrash } from 'react-icons/fa';

// Set the app element for accessibility
Modal.setAppElement('#root');

const MaintenanceTasks = () => {
  const { tasks, loading, error, addTask, updateTask, deleteTask } = useMaintenanceTasks();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null); // For editing
  const { rooms, loading: roomsLoading, error: roomsError, } = useFetchRooms();
  const [formData, setFormData] = useState({
    description: '',
    status: 'Pending',
    assigned_to: '',
    priority: 'Medium',
    cost: '',
    category: 'Plumbing',
    unit: '',
    expected_resolution: '',
  });

  const openModal = (task = null) => {
    setCurrentTask(task);
    if (task) {
      setFormData({
        description: task.description || '',
        status: task.status || 'Pending',
        assigned_to: task.assigned_to?.id || '',
        priority: task.priority || 'Medium',
        cost: task.cost || '',
        category: task.category || 'Plumbing',
        unit: task.unit?.id || '',
        expected_resolution: task.expected_resolution ? task.expected_resolution.split('T')[0] : '',
      });
    } else {
      setFormData({
        description: '',
        status: 'Pending',
        assigned_to: '',
        priority: 'Medium',
        cost: '',
        category: 'Plumbing',
        unit: '',
        expected_resolution: '',
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCurrentTask(null);
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentTask) {
        await updateTask(currentTask.id, formData);
      } else {
        await addTask(formData);
      }
      closeModal();
    } catch (err) {
      // Error handling is managed in the hook
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(taskId);
      } catch (err) {
        // Error handling is managed in the hook
      }
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Maintenance Tasks</h2>
        <button
          onClick={() => openModal()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Task
        </button>
      </div>
      {loading || roomsLoading ? (
        <p>Loading tasks...</p>
      ) : error || roomsLoading ? (
        <p className="text-red-500">Error: {error || roomsLoading}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Task ID</th>
                <th className="py-3 px-6 text-left">Description</th>
                <th className="py-3 px-6 text-center">Status</th>
                <th className="py-3 px-6 text-center">Assigned To</th>
                <th className="py-3 px-6 text-center">Priority</th>
                <th className="py-3 px-6 text-center">Cost</th>
                <th className="py-3 px-6 text-center">Category</th>
                <th className="py-3 px-6 text-center">Unit</th>
                <th className="py-3 px-6 text-center">Expected Resolution</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {tasks.map((task, index) => (
                <tr key={task.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {index + 1}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {task.description}
                  </td>
                  <td className="py-3 px-6 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        task.status === "Completed"
                          ? "bg-green-200 text-green-600"
                          : task.status === "In Progress"
                          ? "bg-yellow-200 text-yellow-600"
                          : "bg-red-200 text-red-600"
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    {task.assigned_to ? task.assigned_to.name : "Unassigned"}
                  </td>
                  <td className="py-3 px-6 text-center">
                    {task.priority}
                  </td>
                  <td className="py-3 px-6 text-center">
                    ${task.cost}
                  </td>
                  <td className="py-3 px-6 text-center">
                    {task.category}
                  </td>
                  <td className="py-3 px-6 text-center">
                    {task.unit ? task.unit.name : "N/A"}
                  </td>
                  <td className="py-3 px-6 text-center">
                    {format(new Date(task.expected_resolution), 'yyyy-MM-dd')}
                  </td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex item-center justify-center">
                      <FaEdit
                        className="text-blue-500 mr-2 cursor-pointer"
                        onClick={() => openModal(task)}
                      />
                      <FaTrash
                        className="text-red-500 cursor-pointer"
                        onClick={() => handleDelete(task.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {tasks.length === 0 && (
                <tr>
                  <td colSpan="10" className="text-center py-4">
                    No maintenance tasks found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Adding/Editing Tasks */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel={currentTask ? "Edit Task" : "Add Task"}
        className="max-w-2xl mx-auto mt-20 bg-white p-6 rounded-lg shadow-lg outline-none"
        overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-start"
      >
        <h2 className="text-2xl font-semibold mb-4">
          {currentTask ? "Edit Task" : "Add New Task"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Description */}
          <div>
            <label className="block text-gray-700">Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          {/* Status */}
          <div>
            <label className="block text-gray-700">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          {/* Assigned To */}
          <div>
            <label className="block text-gray-700">Assigned To</label>
            <select
              name="assigned_to"
              value={formData.assigned_to}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">Unassigned</option>
              {/* Populate options from users collection */}
              {/* Assuming you have a useUsers hook */}
            </select>
          </div>
          {/* Priority */}
          <div>
            <label className="block text-gray-700">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          {/* Cost */}
          <div>
            <label className="block text-gray-700">Cost ($)</label>
            <input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          {/* Category */}
          <div>
            <label className="block text-gray-700">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded"
            >
              <option value="HVAC">HVAC</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Electrical">Electrical</option>
              {/* Add more categories as needed */}
            </select>
          </div>
          {/* Unit */}
          <div>
            <label className="block text-gray-700">Unit</label>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">Select Unit</option>
              {rooms.map((room) => (
                      <option key={room.id} value={room.room_number}>
                        {room.room_number}
                      </option>
              ))}
              {/* Populate options from  collection */}
              {/* Assuming you have a use hook */}
            </select>
          </div>
          {/* Expected Resolution */}
          <div>
            <label className="block text-gray-700">Expected Resolution Date</label>
            <input
              type="date"
              name="expected_resolution"
              value={formData.expected_resolution}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 mr-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              {currentTask ? "Update Task" : "Add Task"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MaintenanceTasks;
