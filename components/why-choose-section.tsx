import { Card, CardContent } from "@/components/ui/card"
import { Users, CheckCircle, Clock, Smile } from "lucide-react"

const features = [
  {
    icon: Users,
    title: "Experienced Team",
    description: "Our team of experts brings years of experience to every project.",
  },
  {
    icon: CheckCircle,
    title: "Quality Assurance",
    description: "We are committed to delivering the highest quality in every aspect.",
  },
  {
    icon: Clock,
    title: "Timely Delivery",
    description: "We ensure projects are completed on time and within budget.",
  },
  {
    icon: Smile,
    title: "Client Satisfaction",
    description: "Your satisfaction is our top priority, and we strive to exceed expectations.",
  },
]

export function WhyChooseSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Why Choose Us?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Experience the DAIGAVILLA difference.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50"
            >
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:scale-110 transition-all">
                  <feature.icon className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
