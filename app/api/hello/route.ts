export async function GET() {
    return new Response ("Hello from Next.js Route handler",{
    status:200, 
});
}
export async function POST(){
    return new Response("Thanks for Posting to this handler", {
status:200,
});
}