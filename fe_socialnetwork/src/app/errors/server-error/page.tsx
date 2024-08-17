"use client"

import { useCommon } from "@/context/commonContext";
import Alert from 'react-bootstrap/Alert';

export default function Page() {
    // hook duoc dung, phai la client component, ko the la server component
    const { commonState } = useCommon();

    return (
        <div>
            <div>
                <h1>500 Internal server error</h1>
                <h4 style={{ color: 'red' }}>{commonState.error?.message}</h4>
            </div>
            <Alert variant="danger"><strong>Stack trace:</strong> {commonState.error?.details}</Alert>
        </div>
    );
}