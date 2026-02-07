"use client";

import { Todo } from "@/types/todo";
import { Check, Pencil, Trash2 } from "lucide-react";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onEdit, onDelete }: TodoItemProps) {
  return (
    <div
      className={`group flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 ${
        todo.completed
          ? "bg-gray-50 border-gray-200 dark:bg-gray-800/50 dark:border-gray-700"
          : "bg-white border-gray-200 hover:border-cyan-300 hover:shadow-md dark:bg-gray-800 dark:border-gray-700 dark:hover:border-cyan-600"
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(todo.id, !todo.completed)}
        className={`shrink-0 w-6 h-6 mt-0.5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
          todo.completed
            ? "bg-cyan-600 border-cyan-600 text-white"
            : "border-gray-300 hover:border-cyan-500 dark:border-gray-600"
        }`}
        aria-label={
          todo.completed ? "Marcar como pendente" : "Marcar como concluída"
        }
      >
        {todo.completed && <Check className="w-4 h-4" />}
      </button>

      {/* Content */}
      <div className="grow min-w-0">
        <h3
          className={`font-medium transition-all duration-200 ${
            todo.completed
              ? "text-gray-400 line-through dark:text-gray-500"
              : "text-gray-900 dark:text-gray-100"
          }`}
        >
          {todo.title}
        </h3>
        {todo.description && (
          <p
            className={`mt-1 text-sm transition-all duration-200 ${
              todo.completed
                ? "text-gray-400 dark:text-gray-600"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            {todo.description}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="shrink-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={() => onEdit(todo)}
          className="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all dark:hover:bg-cyan-900/30"
          aria-label="Editar tarefa"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all dark:hover:bg-red-900/30"
          aria-label="Excluir tarefa"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
