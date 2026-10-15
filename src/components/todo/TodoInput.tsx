"use client";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setFilter } from "@/store/todoSlice";
import { db } from "@/lib/firebase";
import { getFirebaseErrorMessage } from "@/lib/firebaseErrors";
// 💡 [과제 5-hint] addDoc, collection, serverTimestamp를 import하세요.
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function TodoInput() {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submitting = useRef(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedText = text.trim();
    if (trimmedText === "" || submitting.current) return;

    submitting.current = true;
    setIsSubmitting(true);
    setError(null);
    try {
      await addDoc(collection(db, "todos"), {
        text: trimmedText,
        isDone: false,
        createdAt: serverTimestamp(),
      });
      // 완료 필터가 저장되어 있어도 방금 추가한 항목을 볼 수 있게 합니다.
      dispatch(setFilter("all"));
      setText("");
    } catch (error) {
      console.error("할 일 추가 실패:", error);
      setError(getFirebaseErrorMessage(error, "할 일 추가"));
    } finally {
      submitting.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-busy={isSubmitting}
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "8px",
        marginBottom: "24px",
      }}
    >
      <input
        value={text}
        disabled={isSubmitting}
        aria-label="할 일"
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
        disabled={isSubmitting || text.trim() === ""}
        style={{
          padding: "10px 20px",
          backgroundColor: "#4f46e5",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        {isSubmitting ? "추가 중…" : "추가"}
      </button>
      {error && (
        <p role="alert" style={{ width: "100%", margin: 0, color: "#dc2626" }}>
          {error}
        </p>
      )}
    </form>
  );
}
