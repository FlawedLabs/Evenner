export default function LineText({ children }: { children: React.ReactNode }) {
    return (
        <div className="inline-flex justify-center items-center w-full">
            <hr className="my-6 w-96 h-px border-0 bg-gray-200 dark:bg-gray-700" />
            <span className="absolute left-1/2 px-3 font-medium -translate-x-1/2 text-gray-600 dark:text-gray-200 bg-slate-50 dark:bg-[#060d1f]">
                {children}
            </span>
        </div>
    );
}
