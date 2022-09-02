const yupValidatorCompiler: any = ({ schema, method, url, httpPart }: any) => {
    return (data: any) => {
        try {
            const result = schema.validateSync(data, {
                strict: false,
                abortEarly: false,
                stripUnknown: true,
                recursive: true
            })
            return { value: result }
        } catch (err: any) {
            const errors: Array<{ name: string, message: string }> = [];
            err.inner.forEach((e: { path: string; message: string; }) => {
                errors.push({ name: e.path, message: e.message })
            })

            return { error: errors }
        }
    }
}

export default yupValidatorCompiler;