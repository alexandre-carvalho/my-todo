/**
 * Todo item interface for Firestore documents
 */
export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Data for creating a new todo (excludes system fields)
 */
export interface CreateTodoData {
  title: string;
  description?: string;
}

/**
 * Data for updating an existing todo
 */
export interface UpdateTodoData {
  title?: string;
  description?: string;
  completed?: boolean;
}

/**
 * Filter options for todo list
 */
export type TodoFilter = "all" | "active" | "completed";
