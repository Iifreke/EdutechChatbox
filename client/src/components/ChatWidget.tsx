import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Send, Paperclip, Mic, MicOff, Ticket } from "lucide-react";
import { toast } from "sonner";

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  fullName: string;
  email: string;
  university: string;
  phone: string;
}

interface AttachedFile {
  name: string;
  size: number;
  type: string;
}

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  attachments?: AttachedFile[];
}

const WEBHOOK_URL = "https://n8n.edutechconnect.org/webhook/e721a9ac-67c9-42ed-aa83-76559a9f1cc2";
const ADMIN_API_URL = "https://eabt-ai-team-project.vercel.app/api/admin/tickets";

export default function ChatWidget({ isOpen, onClose }: ChatWidgetProps) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    university: "",
    phone: "",
  });
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content: "Hello! Welcome to Edutech. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // File attachment state
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  // Ticket form state
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketDescription, setTicketDescription] = useState("");
  const [ticketSubmitting, setTicketSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    if (!formData.university.trim()) {
      toast.error("Please select a university");
      return;
    }
    if (!formData.phone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          university: formData.university,
          phone: formData.phone,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error("Failed to submit form");
      toast.success("Welcome! Let's get started.");
    } catch (error) {
      console.error("Webhook error:", error);
      toast.error("Error submitting form. Please try again.");
      return;
    }

    setFormSubmitted(true);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: "bot",
        content: `Great to meet you, ${formData.fullName}! I'm here to help you find the perfect program at ${formData.university}. What are you interested in learning?`,
        timestamp: new Date(),
      },
    ]);
  };

  // ── File attachment handlers ──────────────────────────────────

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const meta: AttachedFile[] = files.map((f) => ({
      name: f.name,
      size: f.size,
      type: f.type,
    }));
    setAttachedFiles((prev) => [...prev, ...meta]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  // ── Voice input handler ───────────────────────────────────────

  const handleVoiceToggle = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const SpeechAPI = w.SpeechRecognition ?? w.webkitSpeechRecognition;

    if (!SpeechAPI) {
      toast.error("Voice input is not supported in this browser. Try Chrome or Edge.");
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition = new SpeechAPI();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      if (event.error === "not-allowed") {
        toast.error("Microphone permission denied. Please allow microphone access.");
      } else {
        toast.error(`Voice error: ${event.error}`);
      }
      setIsRecording(false);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };

    recognition.start();
  };

  // ── Send message ─────────────────────────────────────────────

  const handleSendMessage = async () => {
    const hasText = inputValue.trim().length > 0;
    const hasFiles = attachedFiles.length > 0;
    if (!hasText && !hasFiles) return;

    const currentFiles = [...attachedFiles];
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: hasText ? inputValue : `[${currentFiles.length} file(s) attached]`,
      timestamp: new Date(),
      attachments: hasFiles ? currentFiles : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setAttachedFiles([]);
    setIsLoading(true);

    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "chat_message",
          userEmail: formData.email,
          userFullName: formData.fullName,
          message: userMessage.content,
          attachments: currentFiles,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error("Webhook error:", error);
    }

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: "bot",
          content:
            "Thanks for your interest! Our team will be in touch shortly with personalized recommendations for you.",
          timestamp: new Date(),
        },
      ]);
      setIsLoading(false);
    }, 1000);
  };

  // ── Ticket handlers ──────────────────────────────────────────

  const openTicketForm = () => {
    const lastUserMsg = [...messages].reverse().find((m) => m.type === "user");
    setTicketDescription(lastUserMsg?.content ?? "");
    setShowTicketForm(true);
  };

  const handleOpenTicket = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ticketSubject.trim() || !ticketDescription.trim()) {
      toast.error("Please fill in subject and description.");
      return;
    }

    setTicketSubmitting(true);
    const chatContext = messages
      .slice(-5)
      .map((m) => `[${m.type}]: ${m.content}`)
      .join("\n");

    try {
      const res = await fetch(ADMIN_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          subject: ticketSubject.trim(),
          message: ticketDescription.trim(),
        }),
      });

      if (!res.ok) throw new Error("Server error");
      const { ticket } = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: "bot",
          content: `Your support ticket has been submitted! Our team will contact you at ${formData.email} shortly.`,
          timestamp: new Date(),
        },
      ]);

      setShowTicketForm(false);
      setTicketSubject("");
      setTicketDescription("");
      toast.success("Support ticket submitted successfully!");
    } catch {
      toast.error("Could not create ticket. Please try again.");
    } finally {
      setTicketSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Chat Widget */}
      <div className="fixed bottom-4 right-4 w-full max-w-md h-[600px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="gradient-primary text-white p-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Edutech Assistant</h3>
            <p className="text-sm opacity-90">We're here to help</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-smooth"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {!formSubmitted ? (
            // Lead Capture Form
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Before we connect, please tell us a bit about yourself:
                </p>
              </div>

              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: "0ms" }}>
                <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                <Input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleFormChange}
                  placeholder="John Doe"
                  className="w-full border-border focus:ring-2 focus:ring-blue-700"
                />
              </div>

              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: "100ms" }}>
                <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder="john@example.com"
                  className="w-full border-border focus:ring-2 focus:ring-blue-700"
                />
              </div>

              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: "200ms" }}>
                <label className="block text-sm font-medium text-foreground mb-2">University of Interest</label>
                <Input
                  type="text"
                  name="university"
                  value={formData.university}
                  onChange={handleFormChange}
                  placeholder="e.g., Stanford University"
                  className="w-full border-border focus:ring-2 focus:ring-blue-700"
                />
              </div>

              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: "300ms" }}>
                <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full border-border focus:ring-2 focus:ring-blue-700"
                />
              </div>

              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 pt-4" style={{ animationDelay: "400ms" }}>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-700 to-cyan-600 hover:from-blue-800 hover:to-cyan-700 text-white py-6 text-base font-semibold"
                >
                  Start Chat
                </Button>
              </div>
            </form>
          ) : (
            // Chat Messages
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                >
                  <div
                    className={`max-w-xs px-4 py-3 rounded-lg ${
                      message.type === "user"
                        ? "bg-blue-700 text-white rounded-br-none"
                        : "bg-gray-100 text-foreground rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {message.attachments.map((file, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-xs"
                            title={`${file.name} (${formatBytes(file.size)})`}
                          >
                            <Paperclip className="w-3 h-3 shrink-0" />
                            <span className="max-w-[100px] truncate">{file.name}</span>
                          </span>
                        ))}
                      </div>
                    )}
                    <p
                      className={`text-xs mt-1 ${
                        message.type === "user" ? "text-blue-100" : "text-muted-foreground"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-foreground px-4 py-3 rounded-lg rounded-bl-none">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "100ms" }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "200ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Area (only show after form submission) */}
        {formSubmitted && (
          <div className="border-t border-border p-4 bg-gray-50 space-y-2">
            {/* Open a Ticket link / Ticket form */}
            {!showTicketForm ? (
              <button
                type="button"
                onClick={openTicketForm}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-blue-700 transition-colors"
              >
                <Ticket className="w-3 h-3" />
                Open a Support Ticket
              </button>
            ) : (
              <form
                onSubmit={handleOpenTicket}
                className="rounded-xl border border-border bg-white p-3 space-y-2"
              >
                <p className="text-xs font-semibold text-foreground">New Support Ticket</p>
                <Input
                  placeholder="Subject"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="h-8 text-sm"
                />
                <Textarea
                  placeholder="Describe your issue..."
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  rows={3}
                  className="text-sm resize-none"
                />
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    size="sm"
                    disabled={ticketSubmitting}
                    className="h-8 text-xs bg-blue-700 hover:bg-blue-800 text-white"
                  >
                    {ticketSubmitting ? "Submitting..." : "Submit Ticket"}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setShowTicketForm(false)}
                    className="h-8 text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {/* File attachment chips */}
            {attachedFiles.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {attachedFiles.map((file, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs border border-border"
                    title={formatBytes(file.size)}
                  >
                    <Paperclip className="w-3 h-3 shrink-0" />
                    <span className="max-w-[100px] truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="hover:text-red-500 transition-colors"
                      aria-label={`Remove ${file.name}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Input row: paperclip | mic | text input | send */}
            <div className="flex items-center gap-2">
              {/* Attachment button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl border border-border bg-white hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Attach files"
                title="Attach files"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              {/* Voice button */}
              <button
                type="button"
                onClick={handleVoiceToggle}
                className={`shrink-0 w-9 h-9 flex items-center justify-center rounded-xl border transition-colors ${
                  isRecording
                    ? "border-red-400 bg-red-50 text-red-500 animate-pulse"
                    : "border-border bg-white hover:bg-muted text-muted-foreground hover:text-foreground"
                }`}
                aria-label={isRecording ? "Stop recording" : "Start voice input"}
                title={isRecording ? "Stop recording" : "Voice input"}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Text input */}
              <Input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !isLoading) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 border-border focus:ring-2 focus:ring-blue-700"
              />

              {/* Send button */}
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || (!inputValue.trim() && attachedFiles.length === 0)}
                className="shrink-0 bg-blue-700 hover:bg-blue-800 text-white px-3"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx,.txt"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>
        )}
      </div>
    </>
  );
}
