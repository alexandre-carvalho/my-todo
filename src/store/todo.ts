/**
 * Zustand store for Todo state management
 */
import * as todoService from "@/services/todo";
import { CreateTodoData, Todo, TodoFilter, UpdateTodoData } from "@/types/todo";
import { create } from "zustand";

interface TodoStore {
  // State
  todos: Todo[];
  filter: TodoFilter;
  loading: boolean;
  error: string | null;

  // Computed (getters would require different pattern, using selector)
  getFilteredTodos: () => Todo[];

  // Actions
  setFilter: (filter: TodoFilter) => void;
  fetchTodos: (userId: string) => Promise<void>;
  addTodo: (userId: string, data: CreateTodoData) => Promise<void>;
  updateTodo: (todoId: string, data: UpdateTodoData) => Promise<void>;
  toggleComplete: (todoId: string, completed: boolean) => Promise<void>;
  deleteTodo: (todoId: string) => Promise<void>;
  clearError: () => void;
}

export const useTodoStore = create<TodoStore>((set, get) => ({
  todos: [],
  filter: "all",
  loading: false,
  error: null,

  getFilteredTodos: () => {
    const { todos, filter } = get();
    switch (filter) {
      case "active":
        return todos.filter((t) => !t.completed);
      case "completed":
        return todos.filter((t) => t.completed);
      default:
        return todos;
    }
  },

  setFilter: (filter) => set({ filter }),

  fetchTodos: async (userId) => {
    set({ loading: true, error: null });
    try {
      const todos = await todoService.getTodos(userId);
      set({ todos, loading: false });
    } catch (error) {
      set({
        loading: false,
        error:
          error instanceof Error ? error.message : "Erro ao carregar tarefas",
      });
    }
  },

  addTodo: async (userId, data) => {
    set({ loading: true, error: null });
    try {
      const newId = await todoService.addTodo(userId, data);
      const newTodo: Todo = {
        id: newId,
        title: data.title,
        description: data.description,
        completed: false,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      set((state) => ({
        todos: [newTodo, ...state.todos],
        loading: false,
      }));
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Erro ao criar tarefa",
      });
    }
  },

  updateTodo: async (todoId, data) => {
    set({ error: null });
    try {
      await todoService.updateTodo(todoId, data);
      set((state) => ({
        todos: state.todos.map((t) =>
          t.id === todoId ? { ...t, ...data, updatedAt: new Date() } : t,
        ),
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Erro ao atualizar tarefa",
      });
    }
  },

  toggleComplete: async (todoId, completed) => {
    set({ error: null });
    // Optimistic update
    set((state) => ({
      todos: state.todos.map((t) =>
        t.id === todoId ? { ...t, completed, updatedAt: new Date() } : t,
      ),
    }));
    try {
      await todoService.toggleTodoComplete(todoId, completed);
    } catch (error) {
      // Revert on error
      set((state) => ({
        todos: state.todos.map((t) =>
          t.id === todoId ? { ...t, completed: !completed } : t,
        ),
        error:
          error instanceof Error ? error.message : "Erro ao atualizar tarefa",
      }));
    }
  },

  deleteTodo: async (todoId) => {
    set({ error: null });
    const previousTodos = get().todos;
    // Optimistic delete
    set((state) => ({
      todos: state.todos.filter((t) => t.id !== todoId),
    }));
    try {
      await todoService.deleteTodo(todoId);
    } catch (error) {
      // Revert on error
      set({
        todos: previousTodos,
        error:
          error instanceof Error ? error.message : "Erro ao excluir tarefa",
      });
    }
  },

  clearError: () => set({ error: null }),
}));
