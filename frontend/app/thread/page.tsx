import Link from "next/link"
import { ArrowLeft, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/forum/header"
import { Sidebar } from "@/components/forum/sidebar"
import { ThreadPost } from "@/components/forum/thread-post"
import { ThreadSidebar } from "@/components/forum/thread-sidebar"
import { CommentForm } from "@/components/forum/comment-form"
import { CommentItem, type Comment } from "@/components/forum/comment-item"

// Mock data
const mockPost = {
  id: "1",
  title: "Best practices for building scalable microservices architecture in 2024",
  content: `I've been working on transitioning our monolithic application to a microservices architecture and wanted to share some insights and gather community feedback.

After months of research and implementation, here are the key takeaways:

1. **Start with Domain-Driven Design (DDD)**
   Before splitting your monolith, invest time in understanding your domain boundaries. This will help you define service boundaries that make sense for your business.

2. **API Gateway Pattern**
   Implement an API gateway to handle cross-cutting concerns like authentication, rate limiting, and request routing. We've had great success with Kong and AWS API Gateway.

3. **Event-Driven Communication**
   For inter-service communication, prefer asynchronous messaging over synchronous HTTP calls. We use Apache Kafka for event streaming, which has significantly improved our system's resilience.

4. **Observability is Non-Negotiable**
   Implement distributed tracing (we use Jaeger), centralized logging (ELK stack), and comprehensive metrics (Prometheus + Grafana) from day one.

5. **Container Orchestration**
   Kubernetes has been a game-changer for us. The learning curve is steep, but the benefits in terms of scaling and deployment automation are worth it.

What approaches have worked for you? I'm particularly interested in hearing about service mesh implementations and how teams handle data consistency across services.`,
  author: {
    name: "alex_tech",
    avatar: "",
    role: "Senior Dev",
  },
  community: "kernel",
  votes: 342,
  comments: 89,
  views: 12400,
  createdAt: "6 hours ago",
  tags: ["microservices", "architecture", "backend", "devops"],
}

const mockCommunity = {
  name: "kernel",
  description: "Discussions regarding process scheduling, memory management, and file system architecture.",
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
    content: "Great write-up! One thing I'd add is the importance of service contracts. We use OpenAPI specifications for all our services, which makes integration testing much easier and helps with API documentation.",
    votes: 89,
    createdAt: "4 hours ago",
    replies: [
      {
        id: "c1-r1",
        author: { name: "alex_tech", avatar: "", role: "Senior Dev" },
        content: "Absolutely agree! We actually generate our TypeScript clients directly from OpenAPI specs. It's been a huge productivity boost.",
        votes: 34,
        createdAt: "3 hours ago",
        replies: [
          {
            id: "c1-r1-r1",
            author: { name: "code_ninja" },
            content: "What tools do you use for client generation? We've been evaluating openapi-generator but curious about alternatives.",
            votes: 12,
            createdAt: "2 hours ago",
          },
        ],
      },
      {
        id: "c1-r2",
        author: { name: "backend_bob" },
        content: "Contract testing with Pact has also been invaluable for us. Catches breaking changes before they hit production.",
        votes: 21,
        createdAt: "2 hours ago",
      },
    ],
  },
  {
    id: "c2",
    author: { name: "cloud_expert" },
    content: "Have you looked into service mesh solutions like Istio or Linkerd? They can handle a lot of the cross-cutting concerns you mentioned (mTLS, traffic management, observability) without polluting your service code.",
    votes: 56,
    createdAt: "5 hours ago",
    replies: [
      {
        id: "c2-r1",
        author: { name: "alex_tech", avatar: "", role: "Senior Dev" },
        content: "We're actually evaluating Linkerd right now! The resource overhead seems more reasonable compared to Istio. Any tips for the migration?",
        votes: 18,
        createdAt: "4 hours ago",
      },
    ],
  },
  {
    id: "c3",
    author: { name: "startup_cto" },
    content: `Be careful about going too micro too early. We made that mistake and ended up with 50+ services for a team of 10. The operational overhead was crushing.

My advice: start with a "modular monolith" that has clear domain boundaries, then extract services only when you have a clear scaling or team autonomy reason to do so.`,
    votes: 124,
    createdAt: "5 hours ago",
  },
  {
    id: "c4",
    author: { name: "data_dan" },
    content: "How do you handle data consistency across services? We're struggling with the saga pattern and finding it adds a lot of complexity.",
    votes: 45,
    createdAt: "3 hours ago",
  },
]

export default function ThreadPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <main className="lg:ml-64 pt-14">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Back Navigation */}
          <div className="mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Feed
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Post */}
              <ThreadPost post={mockPost} />

              {/* Comment Form */}
              <CommentForm placeholder="What are your thoughts?" />

              {/* Comments Section */}
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
