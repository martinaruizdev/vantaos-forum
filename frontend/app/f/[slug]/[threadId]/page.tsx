import Link from "next/link"
import { ArrowLeft, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/forum/header"
import { Sidebar } from "@/components/forum/sidebar"
import { ThreadPost } from "@/components/forum/thread-post"
import { ThreadSidebar } from "@/components/forum/thread-sidebar"
import { CommentForm } from "@/components/forum/comment-form"
import { CommentItem, type Comment } from "@/components/forum/comment-item"

interface ThreadPageProps {
  params: { slug: string; threadId: string }
}

// Mock data — después vendrá de la API
const mockPost = {
  id: "1",
  title: "Best practices for building scalable microservices architecture in 2024",
  content: `I've been working on transitioning our monolithic application to a microservices architecture and wanted to share some insights and gather community feedback.

After months of research and implementation, here are the key takeaways:

1. Start with Domain-Driven Design (DDD)
2. API Gateway Pattern
3. Event-Driven Communication
4. Observability is Non-Negotiable
5. Container Orchestration with Kubernetes`,
  author: { name: "alex_tech", avatar: "", role: "Senior Dev" },
  community: "programming",
  votes: 342,
  comments: 89,
  views: 12400,
  createdAt: "6 hours ago",
  tags: ["microservices", "architecture", "backend", "devops"],
}

const mockCommunity = {
  name: "programming",
  description: "A community for programmers to discuss coding, software development, and technology.",
  members: 2400000,
  online: 12500,
  createdAt: "Jan 15, 2020",
  rules: [
    "Be respectful and constructive",
    "No spam or self-promotion",
    "Use appropriate tags",
    "Search before posting",
    "Follow the code of conduct",
  ],
}

const mockComments: Comment[] = [
  {
    id: "c1",
    author: { name: "dev_sarah", avatar: "", role: "Moderator" },
    content: "Great write-up! Service contracts with OpenAPI specs make integration testing much easier.",
    votes: 89,
    createdAt: "4 hours ago",
    replies: [
      {
        id: "c1-r1",
        author: { name: "alex_tech", avatar: "", role: "Senior Dev" },
        content: "Absolutely agree! We generate TypeScript clients directly from OpenAPI specs.",
        votes: 34,
        createdAt: "3 hours ago",
        replies: [],
      },
    ],
  },
  {
    id: "c2",
    author: { name: "startup_cto" },
    content: "Be careful about going too micro too early. Start with a modular monolith, then extract services only when needed.",
    votes: 124,
    createdAt: "5 hours ago",
    replies: [],
  },
]

export default async function ThreadPage({ params }: ThreadPageProps) {
  const { slug, threadId } = await params
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />

      <main className="lg:ml-64 pt-14">
        <div className="max-w-6xl mx-auto px-4 py-6">

          {/* Back Navigation → vuelve al foro */}
          <div className="mb-6">
            <Link href={`/f/${slug}`}>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to f/{slug}
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <ThreadPost post={mockPost} />
              <CommentForm placeholder="What are your thoughts?" />

              {/* Comments */}
              <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50">
                <div className="p-4 border-b border-border/30 flex items-center justify-between">
                  <h2 className="font-semibold text-foreground">
                    Comments ({mockComments.length})
                  </h2>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-2">
                    <Filter className="w-4 h-4" />
                    Best
                  </Button>
                </div>
                <div className="divide-y divide-border/30">
                  {mockComments.map((comment) => (
                    <CommentItem key={comment.id} comment={comment} />
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block">
              <ThreadSidebar community={mockCommunity} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}