/**
 * Firestore service for Todo CRUD operations
 */
import { CreateTodoData, Todo, UpdateTodoData } from "@/types/todo";
import { db } from "@/utils/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";

const COLLECTION_NAME = "todos";

/**
 * Convert Firestore timestamp to Date
 */
const toDate = (timestamp: Timestamp | null | undefined): Date => {
  return timestamp?.toDate() ?? new Date();
};

/**
 * Get all todos for a specific user
 */
export const getTodos = async (userId: string): Promise<Todo[]> => {
  const todosRef = collection(db, COLLECTION_NAME);
  const q = query(
    todosRef,
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      description: data.description,
      completed: data.completed,
      userId: data.userId,
      createdAt: toDate(data.createdAt),
      updatedAt: toDate(data.updatedAt),
    } as Todo;
  });
};

/**
 * Add a new todo
 */
export const addTodo = async (
  userId: string,
  data: CreateTodoData,
): Promise<string> => {
  const todosRef = collection(db, COLLECTION_NAME);
  const docRef = await addDoc(todosRef, {
    title: data.title,
    description: data.description ?? "",
    completed: false,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

/**
 * Update an existing todo
 */
export const updateTodo = async (
  todoId: string,
  data: UpdateTodoData,
): Promise<void> => {
  const todoRef = doc(db, COLLECTION_NAME, todoId);
  await updateDoc(todoRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Toggle todo completion status
 */
export const toggleTodoComplete = async (
  todoId: string,
  completed: boolean,
): Promise<void> => {
  await updateTodo(todoId, { completed });
};

/**
 * Delete a todo
 */
export const deleteTodo = async (todoId: string): Promise<void> => {
  const todoRef = doc(db, COLLECTION_NAME, todoId);
  await deleteDoc(todoRef);
};
