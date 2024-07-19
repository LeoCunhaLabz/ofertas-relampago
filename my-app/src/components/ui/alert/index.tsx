type AlertProps = {
  children: React.ReactNode
}
const Alert = ({ children }: AlertProps) => {
  return <div className="p-2 rounded bg-red-100 text-center">{children}</div>
}
export { Alert }
