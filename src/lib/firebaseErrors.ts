export function getFirebaseErrorMessage(error: unknown, action: string): string {
  const code =
    typeof error === "object" && error !== null && "code" in error &&
    typeof error.code === "string"
      ? error.code.replace(/^firestore\//, "")
      : "unknown";

  const details: Record<string, string> = {
    "permission-denied":
      "Firestore 보안 규칙에서 접근을 거부했습니다. Firebase 콘솔의 규칙을 확인해 주세요. DB를 방금 만들거나 규칙을 변경했다면 잠시 후 다시 시도해 주세요.",
    unauthenticated: "Firebase 인증이 필요합니다. 로그인 및 인증 설정을 확인해 주세요.",
    unavailable: "서버에 연결하지 못했습니다. 인터넷 연결을 확인한 뒤 다시 시도해 주세요.",
    "deadline-exceeded": "서버 응답이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.",
    "not-found": "데이터베이스 또는 할 일을 찾을 수 없습니다. Firestore 데이터베이스와 프로젝트 설정을 확인해 주세요.",
    "failed-precondition": "Firestore 데이터베이스 또는 색인 설정을 확인해 주세요. 자세한 오류는 개발자 콘솔에서 볼 수 있습니다.",
    "resource-exhausted": "Firebase 사용량 한도에 도달했습니다. 콘솔에서 사용량을 확인해 주세요.",
  };

  return `${action} 실패 (${code}): ${details[code] ?? "잠시 후 다시 시도해 주세요. 자세한 오류는 개발자 콘솔에서 볼 수 있습니다."}`;
}
