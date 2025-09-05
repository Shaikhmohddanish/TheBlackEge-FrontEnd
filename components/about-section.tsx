"use client"

export function AboutSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/urban-street-photography-dark-moody-aesthetic-graf.png"
          alt="Street Culture Background"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/60" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-in-left">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl mb-6">
              The Culture.{" "}
              <span className="text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text">
                The Movement.
              </span>
            </h2>
            <div className="space-y-6 text-lg text-muted-foreground">
              <p>
                At THE BLACKEGE, we're not just a clothing and accessories brand; we're the embodiment of a cultural
                movement that celebrates authenticity, creativity, and the relentless pursuit of self-expression.
              </p>
              <p>
                Born from the streets and refined through artistry, our pieces represent more than fashion—they're
                statements of identity, rebellion, and the uncompromising spirit of urban culture.
              </p>
              <p>
                Every thread tells a story. Every design challenges convention. Every piece empowers you to stand out in
                a world that often demands conformity.
              </p>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <div className="text-center sm:text-left">
                <div className="text-2xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Happy Customers</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-2xl font-bold text-secondary">50+</div>
                <div className="text-sm text-muted-foreground">Unique Designs</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-2xl font-bold text-primary">5★</div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </div>
            </div>
          </div>

          <div className="relative animate-fade-in-up">
            <div className="relative">
              <img
                src="/streetwear-model-artistic-portrait-dark-aesthetic-.png"
                alt="THE BLACKEGE Model"
                className="w-full h-auto rounded-lg shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
