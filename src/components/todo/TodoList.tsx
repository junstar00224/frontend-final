"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { db } from "@/lib/firebase";
import { Todo } from "@/types/todo";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const { filter } = useSelector((state: RootState) => state.ui);

  // 💡 [과제 4] onSnapshot으로 "todos" 컬렉션을 실시간 구독하세요.
  //    createdAt 기준 내림차순(desc) 정렬
  //    가져온 데이터를 setTodos로 업데이트하세요.
  //    컴포넌트 언마운트 시 구독을 해제하는 클린업 함수를 return하세요.
  useEffect(() => {
    const q = query(collection(db, "todos"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          text: doc.data().text,
          isDone: doc.data().isDone,
          createdAt: doc.data().createdAt,
        }));

        setTodos(items);
      },
      (error) => {
        console.error("할 일 목록 불러오기 실패:", error);
      },
    );
    return () => unsubscribe();
  }, []);

  // 💡 [과제 6] 완료/미완료 토글 — updateDoc으로 isDone 값을 반전시키세요.
  const handleToggle = async (todo: Todo) => {
    await updateDoc(doc(db, "todos", todo.id), {
      isDone: !todo.isDone,
    });
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "todos", id));
  };

  // 💡 [추가 과제 1] deleteDoc으로 할 일을 삭제하는 함수를 작성하고,
  //    아래 <li> 안에 삭제 버튼을 추가해 연결하세요.
  //    import { deleteDoc, doc } from 'firebase/firestore';
  //    const handleDelete = async (id: string) => { await deleteDoc(doc(db, 'todos', id)); };

  // Redux filter 상태로 목록을 필터링합니다.
  const filtered = todos.filter((t) => {
    if (filter === "진행 중") return !t.isDone;
    if (filter === "완료") return t.isDone;
    return true; // 'all'
  });

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {filtered.map((todo) => (
        <li
          key={todo.id}
          onClick={() => handleToggle(todo)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "14px 18px",
            marginBottom: "10px",
            backgroundColor: "white",
            border: "1px solid #eee",
            borderRadius: "10px",
            cursor: "pointer",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            textDecoration: todo.isDone ? "line-through" : "none",
            opacity: todo.isDone ? 0.5 : 1,
          }}
        >
          <span>{todo.isDone ? "✅" : "⬜"}</span>
          <span style={{ flex: 1 }}>{todo.text}</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(todo.id);
            }}
          >
            삭제
          </button>
        </li>
      ))}
      {filtered.length === 0 && (
        <p style={{ textAlign: "center", color: "#aaa" }}>항목이 없습니다.</p>
      )}
    </ul>
  );
}
