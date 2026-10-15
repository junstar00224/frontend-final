"use client";
import { useState } from "react";
import { db } from "@/lib/firebase";
// 💡 [과제 5-hint] addDoc, collection, serverTimestamp를 import하세요.
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function TodoInput() {
  const [text, setText] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() === "") return;

    // 💡 [과제 5] "todos" 컬렉션에 { text, isDone: false, createdAt: serverTimestamp() }를 저장하세요.
    /* 코드를 작성하세요 */
    await addDoc(collection(db, "todos"), {
      text,
      isDone: false,
      createAt: serverTimestamp(),
    });

    setText("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", gap: "8px", marginBottom: "24px" }}
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="할 일을 입력하세요"
        style={{
          flex: 1,
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ddd",
          fontSize: "1rem",
        }}
      />
      <button
        type="submit"
        style={{
          padding: "10px 20px",
          backgroundColor: "#4f46e5",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        추가
      </button>
    </form>
  );
}
