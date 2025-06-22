const Task = require("../models/Task");

exports.createTask = async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, user: req.user.id }); // ✅ use `user` not `userId`
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ msg: "Error creating task", error: err.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }); // ✅ use `user`
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching tasks", error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id }, // ✅ use `user`
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ msg: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: "Error updating task", error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const result = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id }); // ✅ use `user`
    if (!result) return res.status(404).json({ msg: "Task not found" });
    res.json({ msg: "Task deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting task", error: err.message });
  }
};
