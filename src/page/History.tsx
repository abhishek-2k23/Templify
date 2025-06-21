"use client"

import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Download, FileText, Calendar, Trash2 } from "lucide-react"
import { useHistory } from "../context/useHistory"

export default function HistoryPage() {
  const { history } = useHistory()

  const handleDownload = (templateName: string, fileType: string) => {
    // Simulate download
    console.log(`Downloading ${templateName} as ${fileType}`)
  }

  const handleDelete = (templateId: string) => {
    // Simulate delete
    console.log(`Deleting template ${templateId}`)
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4 animate-slide-up">
        <h1 className="text-4xl font-bold text-white">Template History</h1>
        <p className="text-gray-300">View and re-download your previously created templates</p>
      </div>

      {/* Templates Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {history.map((template, index) => (
          <Card
            key={template.id}
            className="bg-black/10 border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-lg ${
                      template.fileName.endsWith('.pdf')
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}
                  >
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">
                      {template.fileName}
                    </CardTitle>
                    <div className="flex items-center space-x-1 text-gray-400 text-sm mt-1">
                      <Calendar className="w-3 h-3" />
                      <span>{template.timestamp.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(template.id)}
                  className="text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-gray-300 text-sm line-clamp-2">
                  {template.template}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() =>
                    handleDownload(template.fileName, template.template)
                  }
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 flex-1 transition-all duration-300"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Re-download
                </Button>
                <div className="bg-white/10 rounded px-3 py-2 text-white text-sm font-medium">
                  {template.fileName.endsWith('.pdf') ? 'PDF' : 'TXT'}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {history.length === 0 && (
        <div className="text-center py-16 animate-slide-up">
          <FileText className="w-16 h-16 text-white/40 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No templates yet</h3>
          <p className="text-gray-400 mb-6">Create your first template to see it here</p>
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            Create Template
          </Button>
        </div>
      )}
    </div>
  )
}
