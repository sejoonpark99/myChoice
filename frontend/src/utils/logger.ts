export async function logToServer(
  level: "DEBUG" | "INFO" | "WARNING" | "ERROR" | "CRITICAL",
  message: string,
  context: Record<string, any> = {}
) {
  // Debug: Log the call stack to see where this is being called from
  console.log("logToServer called from:", new Error().stack);
  console.log("logToServer params:", { level, message, context });

  const payload = {
    level,
    service: "frontend", 
    message,
    context,
  };

  console.log("Logging payload:", payload); 

  const response = await fetch("http://localhost:8000/api/logs/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Failed to log to server:", errorData);
  }
}