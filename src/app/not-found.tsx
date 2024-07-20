import Link from 'next/link'
import FloatButtonComponent from './components/FloatButton'

export default function NotFound() {
    return (
        <div>
            <h2>Not Found</h2>
            <p>Could not find requested resource</p>
            <Link href="/">Return Home</Link>
            <FloatButtonComponent />
        </div>
    )
}