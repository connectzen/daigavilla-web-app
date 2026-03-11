import { Card, CardContent } from "@/components/ui/card"

export function AboutSection() {
  return (
    <section id="about" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">About Us</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Learn more about DAIGAVILLA Ltd and our commitment to excellence in construction and real estate.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
          <div>
            <h3 className="text-3xl font-bold text-foreground mb-6">Our Story</h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              DAIGAVILLA Ltd was founded with a vision to transform the construction and real estate industry through
              innovation, quality, and customer satisfaction. We have been serving our clients with dedication and
              excellence for years.
            </p>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Our team of experienced professionals brings together expertise in architecture, engineering, project
              management, and construction to deliver outstanding results that exceed expectations.
            </p>

            <div className="grid grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-primary to-purple-600 border-0">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-white mb-2">50+</div>
                  <div className="text-white/90 text-sm">Projects Completed</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-accent to-yellow-500 border-0">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-white mb-2">100%</div>
                  <div className="text-white/90 text-sm">Client Satisfaction</div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h4 className="font-bold text-foreground mb-2">Quality Assurance</h4>
                <p className="text-sm text-muted-foreground">
                  We maintain the highest standards of quality in all our projects.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow mt-8">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h4 className="font-bold text-foreground mb-2">Expert Team</h4>
                <p className="text-sm text-muted-foreground">
                  Our team of experts brings years of experience to every project.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h4 className="font-bold text-foreground mb-2">Timely Delivery</h4>
                <p className="text-sm text-muted-foreground">
                  We ensure projects are completed on time and within budget.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow mt-8">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h4 className="font-bold text-foreground mb-2">Customer Focus</h4>
                <p className="text-sm text-muted-foreground">
                  Your satisfaction is our top priority in everything we do.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
