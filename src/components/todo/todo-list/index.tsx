"use client";

import { Todo, TodoFilter } from "@/types/todo";
import { ClipboardList } from "lucide-react";
import { TodoItem } from "../todo-item";

interface TodoListProps {
  todos: Todo[];
  filter: TodoFilter;
  onFilterChange: (filter: TodoFilter) => void;
  onToggle: (id: string, completed: boolean) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

const filterOptions: { value: TodoFilter; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "active", label: "Pendentes" },
  { value: "completed", label: "Concluídas" },
];

export function TodoList({
  todos,
  filter,
  onFilterChange,
  onToggle,
  onEdit,
  onDelete,
}: TodoListProps) {
  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;

  // Get filtered todos
  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onFilterChange(option.value)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                filter === option.value
                  ? "bg-white text-cyan-700 shadow-sm dark:bg-gray-700 dark:text-cyan-400"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <span className="font-medium text-cyan-600 dark:text-cyan-400">
            {activeCount}
          </span>{" "}
          pendente{activeCount !== 1 && "s"}
          {completedCount > 0 && (
            <span className="ml-2">
              ·{" "}
              <span className="font-medium text-green-600 dark:text-green-400">
                {completedCount}
              </span>{" "}
              concluída{completedCount !== 1 && "s"}
            </span>
          )}
        </div>
      </div>

      {/* Todo list */}
      {filteredTodos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <ClipboardList className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {filter === "all"
              ? "Nenhuma tarefa ainda"
              : filter === "active"
                ? "Nenhuma tarefa pendente"
                : "Nenhuma tarefa concluída"}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {filter === "all"
              ? "Comece adicionando sua primeira tarefa acima!"
              : "Mude o filtro para ver outras tarefas."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
