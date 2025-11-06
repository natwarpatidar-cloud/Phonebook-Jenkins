export default function Auth({ children }){
    return (
        <div className="h-[100vh] flex items-center justify-center">
            <div className="md:h-auto md:w-[450px] border-none p-10 shadow-2xl rounded-2xl">
                { children }
            </div>
        </div>
    );
};