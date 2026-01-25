import { UploadIcon, VideoIcon, ZapIcon } from 'lucide-react';

export const featuresData = [
    {
        icon: <UploadIcon className="w-6 h-6" />,
        title: 'Easy And Smart Upload',
        desc: 'Just Drag and Drop Your Files Here. Spectra Will Optimize It For You.'
    },
    {
        icon: <ZapIcon className="w-6 h-6" />,
        title: 'Continous Generation',
        desc: 'Spectra Generates Every Type of video instantly. No Waiting.'
    },
    {
        icon: <VideoIcon className="w-6 h-6" />,
        title: 'Video Synthesis',
        desc: 'Bring Images and files to Life With Spectra.'
    }
];

export const plansData = [
    {
        id: 'starter',
        name: 'Starter',
        price: '$10',
        desc: 'Try Spectra For Free.',
        credits: 25,
        features: [
            '25 Credits',
            'Standard Quality',
            'No Watermark',
            'Slower Generation Speed',
            'Email support'
        ]
    },
    {
        id: 'pro',
        name: 'Pro',
        price: '$29',
        desc: 'For small to medium brands.',
        credits: 80,
        features: [
            '80 Credits',
            'HD Quality',
            'No Watermark',
            'Faster Generation Speed',
            'Priority support'
        ],
        popular: true
    },
    {
        id: 'ultra',
        name: 'Ultra',
        price: '$99',
        desc: 'For large brands.',
        credits: 300,
        features: [
            '300 Credits',
            'FHD Quality',
            'No Watermark',
            'Fastest Generation Speed',
            '24/7 support'
        ]
    }
];

export const faqData = [
    {
        question: 'How Spectra Generates Your Content?',
        answer: 'Spectra uses State-Of-The-Art Diffusion Models Trained On Millions of Images and Content. It Blends Images and Text to Create Unique and Engaging Content.'
    },
    {
        question: 'Do I Own My Content?',
        answer: 'Yes - You own your content Through Commercial Rights. We do not sell or share your content with third parties.'
    },
    {
        question: 'Can I Cancel My Subscription?',
        answer: 'Yes - You can cancel your subscription at any time. We will not charge you after the end of your subscription period.'
    },
    {
        question: 'What Formats Does Spectra Support?',
        answer: 'Spectra supports a wide range of file formats, including JPEG, PNG, and WebP. Outputs are in High Definition PNGs and MP4s format.'
    }
];

export const footerLinks = [
    {
        title: "Fast Links",
        links: [
            { name: "Home", url: "#" },
            { name: "Features", url: "#" },
            { name: "Pricing", url: "#" },
            { name: "FAQ", url: "#" }
        ]
    },
    {
        title: "Legal",
        links: [
            { name: "Privacy Policy", url: "#" },
            { name: "Terms of Service", url: "#" }
        ]
    },
    {
        title: "Connect",
        links: [
            { name: "Instagram", url: "#" },
            { name: "LinkedIn", url: "#" },
            { name: "GitHub", url: "#" }
        ]
    }
];