package com.taskflow.service;

import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.model.Task;
import com.taskflow.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskServiceImpl taskService;

    private Task sampleTask;

    @BeforeEach
    void setUp() {
        sampleTask = new Task();
        sampleTask.setId(1L);
        sampleTask.setTitle("Write unit tests");
        sampleTask.setStatus(Task.TaskStatus.PENDING);
        sampleTask.setPriority(Task.Priority.HIGH);
    }

    @Test
    void getTaskById_returnsTask_whenExists() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(sampleTask));

        Task result = taskService.getTaskById(1L);

        assertEquals("Write unit tests", result.getTitle());
        verify(taskRepository, times(1)).findById(1L);
    }

    @Test
    void getTaskById_throwsException_whenNotFound() {
        when(taskRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> taskService.getTaskById(99L));
    }

    @Test
    void createTask_savesAndReturnsTask() {
        when(taskRepository.save(any(Task.class))).thenReturn(sampleTask);

        Task result = taskService.createTask(sampleTask);

        assertNotNull(result);
        assertEquals(Task.Priority.HIGH, result.getPriority());
        verify(taskRepository).save(sampleTask);
    }

    @Test
    void updateTask_updatesFields_whenTaskExists() {
        Task updated = new Task();
        updated.setTitle("Updated title");
        updated.setStatus(Task.TaskStatus.COMPLETED);
        updated.setPriority(Task.Priority.LOW);

        when(taskRepository.findById(1L)).thenReturn(Optional.of(sampleTask));
        when(taskRepository.save(any(Task.class))).thenAnswer(inv -> inv.getArgument(0));

        Task result = taskService.updateTask(1L, updated);

        assertEquals("Updated title", result.getTitle());
        assertEquals(Task.TaskStatus.COMPLETED, result.getStatus());
    }

    @Test
    void deleteTask_deletesTask_whenExists() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(sampleTask));
        doNothing().when(taskRepository).delete(sampleTask);

        taskService.deleteTask(1L);

        verify(taskRepository, times(1)).delete(sampleTask);
    }

    @Test
    void getAllTasks_returnsAllTasks() {
        when(taskRepository.findAll()).thenReturn(List.of(sampleTask));

        List<Task> result = taskService.getAllTasks();

        assertEquals(1, result.size());
    }
}
