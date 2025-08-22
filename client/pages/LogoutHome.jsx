"use client"
import { Link } from "react-router-dom"
import { Sprout, BarChart3, Cloud } from "lucide-react"

const LogoutHome = () => {
    const features = [
        {
            icon: <BarChart3 className="w-8 h-8 text-primary" />,
            title: "Data Analytics",
            description: "Make informed decisions with real-time crop and soil analytics",
        },
        {
            icon: <Cloud className="w-8 h-8 text-primary" />,
            title: "Weather Insights",
            description: "Get precise weather forecasts and alerts for your location",
        },
        {
            icon: <Sprout className="w-8 h-8 text-primary" />,
            title: "Crop Advisory",
            description: "Receive personalized recommendations for optimal crop growth",
        },
    ]

    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "Organic Farmer",
            content:
                "Smart Farming has revolutionized how I manage my crops. The weather alerts alone have saved me thousands.",
            avatar: "/placeholder.svg?height=60&width=60",
        },
        {
            name: "Mike Chen",
            role: "Agricultural Consultant",
            content:
                "The data analytics feature provides insights I never had before. It's like having a team of experts in my pocket.",
            avatar: "/placeholder.svg?height=60&width=60",
        },
    ]

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/5">
                <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1200')] bg-cover bg-center opacity-10"></div>
                <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
                    <h1 className="font-serif font-black text-5xl md:text-7xl mb-6 text-foreground leading-tight">
                        Transform Your Farm with <span className="text-primary">Smart Technology</span>
                    </h1>
                    <p className="font-sans text-xl md:text-2xl mb-8 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Harness the power of data-driven decisions for sustainable farming. Join thousands of farmers already
                        growing smarter.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            to="/register"
                            className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-sans font-semibold text-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                            Get Started Free
                        </Link>
                        <Link
                            to="/login"
                            className="bg-card border-2 border-primary text-primary px-8 py-4 rounded-lg font-sans font-semibold text-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-lg"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-muted/30">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="font-serif font-bold text-4xl md:text-5xl mb-4 text-foreground">
                            Why Choose Smart Farming?
                        </h2>
                        <p className="font-sans text-xl text-muted-foreground max-w-2xl mx-auto">
                            Cutting-edge technology meets traditional farming wisdom
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-card p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-border"
                            >
                                <div className="mb-4">{feature.icon}</div>
                                <h3 className="font-serif font-bold text-2xl mb-3 text-card-foreground">{feature.title}</h3>
                                <p className="font-sans text-muted-foreground leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-primary text-primary-foreground">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="font-serif font-black text-5xl mb-2">10K+</div>
                            <div className="font-sans text-xl opacity-90">Active Farmers</div>
                        </div>
                        <div>
                            <div className="font-serif font-black text-5xl mb-2">25%</div>
                            <div className="font-sans text-xl opacity-90">Yield Increase</div>
                        </div>
                        <div>
                            <div className="font-serif font-black text-5xl mb-2">30%</div>
                            <div className="font-sans text-xl opacity-90">Cost Reduction</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-background">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="font-serif font-bold text-4xl md:text-5xl mb-4 text-foreground">
                            Trusted by Farmers Worldwide
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="bg-card p-8 rounded-xl shadow-lg border border-border">
                                <p className="font-sans text-lg mb-6 text-card-foreground leading-relaxed italic">
                                    "{testimonial.content}"
                                </p>
                                <div className="flex items-center gap-4">
                                    <img
                                        src={testimonial.avatar || "/placeholder.svg"}
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full"
                                    />
                                    <div>
                                        <div className="font-serif font-semibold text-card-foreground">{testimonial.name}</div>
                                        <div className="font-sans text-muted-foreground">{testimonial.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-accent/10 to-primary/10">
                <div className="max-w-4xl mx-auto text-center px-6">
                    <h2 className="font-serif font-bold text-4xl md:text-5xl mb-6 text-foreground">Ready to Grow Smarter?</h2>
                    <p className="font-sans text-xl mb-8 text-muted-foreground">
                        Join the agricultural revolution today. No credit card required.
                    </p>
                    <Link
                        to="/register"
                        className="inline-block bg-accent text-accent-foreground px-10 py-4 rounded-lg font-sans font-semibold text-lg hover:bg-accent/90 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                        Start Your Free Trial
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-foreground text-background py-12">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="font-serif font-bold text-2xl mb-4 flex items-center gap-2">
                                <Sprout className="w-6 h-6" />
                                Smart Farming
                            </h3>
                            <p className="font-sans opacity-80">
                                Empowering farmers with intelligent technology for sustainable agriculture.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-serif font-semibold text-lg mb-4">Product</h4>
                            <ul className="font-sans space-y-2 opacity-80">
                                <li>Features</li>
                                <li>Pricing</li>
                                <li>API</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-serif font-semibold text-lg mb-4">Support</h4>
                            <ul className="font-sans space-y-2 opacity-80">
                                <li>Help Center</li>
                                <li>Contact Us</li>
                                <li>Community</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-serif font-semibold text-lg mb-4">Company</h4>
                            <ul className="font-sans space-y-2 opacity-80">
                                <li>About</li>
                                <li>Blog</li>
                                <li>Careers</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-background/20 mt-8 pt-8 text-center font-sans opacity-60">
                        © 2024 Smart Farming. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default LogoutHome
