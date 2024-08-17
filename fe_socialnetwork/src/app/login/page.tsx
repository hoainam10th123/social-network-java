'use client'

import Button from 'react-bootstrap/Button';
import { ErrorMessage, Formik, Form } from "formik";
import * as yup from 'yup';
import FormBt from 'react-bootstrap/Form';


function Page() {
    const schema = yup.object().shape({
        username: yup.string().required(),
        password: yup.string().required(),
    });

    return (
        <Formik
            validationSchema={schema}
            initialValues={{ username: '', password: '', error: null }}
            onSubmit={(value, { setErrors }) => console.log()}
        >
            {({ handleSubmit, isValid, isSubmitting, dirty, errors }) => (
                <div className='form-signin'>
                    <Form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                        onSubmit={handleSubmit} autoComplete='off'>

                        <img className="mb-4" src="/bootstrap-logo.svg" alt="" width="72" height="57" />
                        <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

                        <FormBt.Group className="mb-3 w-100">
                            <FormBt.Control type="text" placeholder="Enter username" />
                        </FormBt.Group>

                        <FormBt.Group className="mb-3 w-100">
                            <FormBt.Control type="password" placeholder="Password" />
                        </FormBt.Group>

                        <ErrorMessage name="error" render={() => <div className="text-danger">{errors.error}</div>} />

                        <Button className="w-100" disabled={isSubmitting || !dirty || !isValid} variant="primary" type="submit">
                            {isSubmitting ? 'Loading...' : 'Login'}
                        </Button>
                    </Form>
                </div>
            )}
        </Formik>
    );
}

export default Page;