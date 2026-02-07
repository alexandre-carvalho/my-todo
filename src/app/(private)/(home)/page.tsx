"use client";

import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { Loader2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useTodoStore } from "@/store/todo";
import { Todo, TodoFilter } from "@/types/todo";
import { auth } from "@/utils/firebase";

import { AddTodo } from "@/components/todo/add-todo";
import { EditTodoModal } from "@/components/todo/edit-todo-modal";
import { TodoList } from "@/components/todo/todo-list";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { useToast } from "@/components/ui/toast";

export default function Home() {
  const router = useRouter();
  const { showToast } = useToast();
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [deletingTodoId, setDeletingTodoId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const {
    todos,
    filter,
    loading,
    error,
    setFilter,
    fetchTodos,
    addTodo,
    updateTodo,
    toggleComplete,
    deleteTodo,
    clearError,
  } = useTodoStore();

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch todos when user is available
  useEffect(() => {
    if (user?.uid) {
      fetchTodos(user.uid);
    }
  }, [user?.uid, fetchTodos]);

  // Show error toast
  useEffect(() => {
    if (error) {
      showToast(error, "error");
      clearError();
    }
  }, [error, showToast, clearError]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut(auth);
      await fetch("/api/sign-out", { method: "POST" });
      router.refresh();
      router.push("/sign-in");
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
      showToast("Ocorreu um erro ao sair. Tente novamente.", "error");
      setIsSigningOut(false);
    }
  };

  const handleAddTodo = async (data: {
    title: string;
    description?: string;
  }) => {
    if (!user?.uid) return;
    await addTodo(user.uid, data);
    showToast("Tarefa criada com sucesso!", "success");
  };

  const handleToggle = async (id: string, completed: boolean) => {
    await toggleComplete(id, completed);
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
  };

  const handleSaveEdit = async (
    id: string,
    data: { title?: string; description?: string },
  ) => {
    await updateTodo(id, data);
    showToast("Tarefa atualizada!", "success");
  };

  // Open delete confirmation modal
  const handleDeleteClick = (id: string) => {
    setDeletingTodoId(id);
  };

  // Confirm deletion
  const handleConfirmDelete = async () => {
    if (!deletingTodoId) return;

    setIsDeleting(true);
    await deleteTodo(deletingTodoId);
    setIsDeleting(false);
    setDeletingTodoId(null);
    showToast("Tarefa excluída com sucesso!", "success");
  };

  // Cancel deletion
  const handleCancelDelete = () => {
    setDeletingTodoId(null);
  };

  const handleFilterChange = (newFilter: TodoFilter) => {
    setFilter(newFilter);
  };

  // Show loading while checking auth state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-cyan-600 animate-spin" />
          <p className="text-gray-500 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200 dark:bg-gray-900/80 dark:border-gray-800">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Minhas Tarefas
            </h1>
            {user?.email && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user.email}
              </p>
            )}
          </div>
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all dark:text-gray-300 dark:hover:bg-red-900/30 dark:hover:text-red-400 disabled:opacity-50"
          >
            {isSigningOut ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogOut className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Add todo form */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700">
            <AddTodo onAdd={handleAddTodo} isLoading={loading} />
          </section>

          {/* Todo list */}
          <section>
            {loading && todos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-cyan-600 animate-spin mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Carregando tarefas...
                </p>
              </div>
            ) : (
              <TodoList
                todos={todos}
                filter={filter}
                onFilterChange={handleFilterChange}
                onToggle={handleToggle}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            )}
          </section>
        </div>
      </main>

      {/* Edit modal */}
      <EditTodoModal
        todo={editingTodo}
        isOpen={editingTodo !== null}
        onClose={() => setEditingTodo(null)}
        onSave={handleSaveEdit}
      />

      {/* Delete confirmation modal */}
      <ConfirmModal
        isOpen={deletingTodoId !== null}
        title="Excluir tarefa"
        message="Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
