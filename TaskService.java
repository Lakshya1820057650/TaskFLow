package com.taskflow.service;

import com.taskflow.model.Task;

import java.util.List;

public interface TaskService {
    List<Task> getAllTasks();
    Task getTaskById(Long id);
    Task createTask(Task task);
    Task updateTask(Long id, Task updatedTask);
    void deleteTask(Long id);
    List<Task> getTasksByStatus(Task.TaskStatus status);
    List<Task> searchByTitle(String keyword);
}
