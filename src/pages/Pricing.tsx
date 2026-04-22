const Pricing = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20 px-4">
            <div className="bg-white rounded-2xl shadow-xl p-12 max-w-xl w-full text-center">
                <h1 className="font-heading text-4xl md:text-5xl text-yoga-pink italic font-light mb-10">
                    Pricing
                </h1>

                <div className="space-y-6 mb-10">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                        <span className="font-heading text-xl text-gray-800 font-light">Class</span>
                        <span className="text-2xl font-bold text-yoga-blue">$15 / hour</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                        <span className="font-heading text-xl text-gray-800 font-light">Private / Group / Family Sessions</span>
                        <span className="text-2xl font-bold text-yoga-pink">$65 / hour</span>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-yoga-pink to-yoga-blue rounded-xl p-6 text-white space-y-3">
                    <p className="text-2xl font-bold tracking-wide">FIRST CLASS FREE!</p>
                    <p className="text-lg font-semibold tracking-wider">Prior Booking Essential</p>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
