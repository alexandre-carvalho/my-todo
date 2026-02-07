"use client";

import { CreateTodoData } from "@/types/todo";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";

interface AddTodoProps {
  onAdd: (data: CreateTodoData) => Promise<void>;
  isLoading?: boolean;
}

export function AddTodo({ onAdd, isLoading }: AddTodoProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showDescription, setShowDescription] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await onAdd({
      title: title.trim(),
      description: description.trim() || undefined,
    });

    setTitle("");
    setDescription("");
    setShowDescription(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-3">
        <div className="grow">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Adicionar nova tarefa..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={!title.trim() || isLoading}
          className="shrink-0 px-6 py-3 bg-cyan-600 text-white font-medium rounded-xl hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 dark:focus:ring-offset-gray-900"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Adicionar</span>
            </>
          )}
        </button>
      </div>

      {/* Toggle description */}
      {!showDescription && (
        <button
          type="button"
          onClick={() => setShowDescription(true)}
          className="text-sm text-gray-500 hover:text-cyan-600 transition-colors dark:text-gray-400 dark:hover:text-cyan-400"
        >
          + Adicionar descrição
        </button>
      )}

      {/* Description field */}
      {showDescription && (
        <div className="animate-in slide-in-from-top-2 duration-200">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descrição (opcional)"
            rows={2}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => {
              setShowDescription(false);
              setDescription("");
            }}
            className="text-sm text-gray-500 hover:text-red-500 transition-colors mt-1 dark:text-gray-400"
          >
            Remover descrição
          </button>
        </div>
      )}
    </form>
  );
}
