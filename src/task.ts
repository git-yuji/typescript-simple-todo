// Todoアプリで扱うタスクの形を定義します。
// プロパティを不足させたり、違う型の値を入れたりすると、
// TypeScriptが実行前に間違いを知らせてくれます。
export type Task = {
  id: string
  title: string
  done: boolean
  createdAt: string
}
