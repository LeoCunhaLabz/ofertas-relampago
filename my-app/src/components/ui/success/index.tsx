type SuccessProps = {
  children: React.ReactNode
}
const Success = ({ children }: SuccessProps) => {
  return <div className="p-2 rounded bg-green-100 text-center">{children}</div>
}
export { Success }
