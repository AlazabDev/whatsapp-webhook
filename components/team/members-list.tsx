"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useState, useEffect } from "react"

interface Member {
  id: string
  user_id: string
  role: "admin" | "member" | "viewer"
  created_at: string
  users: {
    email: string
    full_name: string
    avatar_url?: string
  }
}

interface MembersListProps {
  projectId: string
  onRemove?: (member: Member) => void
  onRoleChange?: (member: Member, newRole: string) => void
}

export function MembersList({ projectId, onRemove, onRoleChange }: MembersListProps) {
  const [members, setMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMembers()
  }, [projectId])

  const fetchMembers = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/team/members/list?projectId=${projectId}`)

      if (!response.ok) {
        throw new Error("فشل في تحميل الأعضاء")
      }

      const data = await response.json()
      setMembers(data.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="text-center py-8 text-slate-500">جاري التحميل...</div>
  }

  if (members.length === 0) {
    return <div className="text-center py-8 text-slate-500">لا يوجد أعضاء</div>
  }

  return (
    <div className="space-y-4">
      {members.map((member) => (
        <Card key={member.id}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">{member.users.full_name || member.users.email}</h3>
                <p className="text-sm text-slate-500">{member.users.email}</p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={member.role}
                  onChange={(e) => onRoleChange?.(member, e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-md text-sm"
                >
                  <option value="viewer">عارض</option>
                  <option value="member">عضو</option>
                  <option value="admin">مسؤول</option>
                </select>

                <Button size="sm" variant="destructive" onClick={() => onRemove?.(member)}>
                  إزالة
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
