import { useState, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { FamilyMember, Chore, Event, MonthlyCompetition, WeeklyCompetition } from '@/lib/types'
import {
  createBackup,
  downloadBackup,
  validateBackup,
  readFileAsText,
  getBackupStats,
  formatFileSize,
  BackupData,
} from '@/lib/data-backup'
import {
  DownloadSimple,
  UploadSimple,
  CheckCircle,
  Warning,
  FileArrowUp,
  Users,
  ListChecks,
  CalendarBlank,
  Trophy,
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface DataBackupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  members: FamilyMember[]
  chores: Chore[]
  events: Event[]
  monthlyCompetitions: MonthlyCompetition[]
  weeklyCompetitions: WeeklyCompetition[]
  settings?: BackupData['data']['settings']
  onImport: (data: BackupData['data']) => void
}

type ImportStep = 'select' | 'preview' | 'confirm'

export function DataBackupDialog({
  open,
  onOpenChange,
  members,
  chores,
  events,
  monthlyCompetitions,
  weeklyCompetitions,
  settings = {},
  onImport,
}: DataBackupDialogProps) {
  const [mode, setMode] = useState<'menu' | 'export' | 'import'>('menu')
  const [importStep, setImportStep] = useState<ImportStep>('select')
  const [importData, setImportData] = useState<BackupData['data'] | null>(null)
  const [importWarnings, setImportWarnings] = useState<string[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    const backup = createBackup(
      members,
      chores,
      events,
      monthlyCompetitions,
      weeklyCompetitions,
      settings
    )
    downloadBackup(backup)
    toast.success('Backup downloaded!', {
      description: 'Your family data has been saved to a file.',
    })
    onOpenChange(false)
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSelectedFile(file)

    try {
      const text = await readFileAsText(file)
      const result = validateBackup(text)

      if (!result.success) {
        toast.error('Invalid backup file', { description: result.message })
        setSelectedFile(null)
        return
      }

      setImportData(result.data!)
      setImportWarnings(result.warnings || [])
      setImportStep('preview')
    } catch {
      toast.error('Failed to read file')
      setSelectedFile(null)
    }
  }

  const handleImportConfirm = () => {
    if (!importData) return

    onImport(importData)
    toast.success('Data imported successfully!', {
      description: `Imported ${importData.members.length} members, ${importData.chores.length} chores, and ${importData.events.length} events.`,
    })
    handleClose()
  }

  const handleClose = () => {
    setMode('menu')
    setImportStep('select')
    setImportData(null)
    setImportWarnings([])
    setSelectedFile(null)
    onOpenChange(false)
  }

  const currentStats = getBackupStats({ members, chores, events, monthlyCompetitions, weeklyCompetitions, settings })

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === 'menu' && '💾 Data Backup'}
            {mode === 'export' && '📤 Export Data'}
            {mode === 'import' && '📥 Import Data'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'menu' && 'Backup your family data or restore from a previous backup.'}
            {mode === 'export' && 'Download a backup file containing all your family data.'}
            {mode === 'import' && 'Restore your data from a backup file.'}
          </DialogDescription>
        </DialogHeader>

        {/* Main Menu */}
        {mode === 'menu' && (
          <div className="space-y-4 py-4">
            <button
              onClick={() => setMode('export')}
              className="w-full p-4 rounded-lg border-2 border-dashed hover:border-primary hover:bg-primary/5 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <DownloadSimple className="w-6 h-6 text-green-600 dark:text-green-400" weight="bold" />
                </div>
                <div>
                  <p className="font-semibold">Export Backup</p>
                  <p className="text-sm text-muted-foreground">Download your data as a file</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setMode('import')}
              className="w-full p-4 rounded-lg border-2 border-dashed hover:border-primary hover:bg-primary/5 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <UploadSimple className="w-6 h-6 text-blue-600 dark:text-blue-400" weight="bold" />
                </div>
                <div>
                  <p className="font-semibold">Import Backup</p>
                  <p className="text-sm text-muted-foreground">Restore from a backup file</p>
                </div>
              </div>
            </button>

            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground text-center">
                Current data: {currentStats.members} members, {currentStats.chores} chores, {currentStats.events} events
              </p>
            </div>
          </div>
        )}

        {/* Export View */}
        {mode === 'export' && (
          <div className="space-y-4 py-4">
            <div className="p-4 rounded-lg bg-muted/50 space-y-3">
              <p className="text-sm font-medium">Your backup will include:</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>{currentStats.members} members</span>
                </div>
                <div className="flex items-center gap-2">
                  <ListChecks className="w-4 h-4 text-muted-foreground" />
                  <span>{currentStats.chores} chores</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarBlank className="w-4 h-4 text-muted-foreground" />
                  <span>{currentStats.events} events</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-muted-foreground" />
                  <span>{currentStats.competitions} competitions</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setMode('menu')} className="flex-1">
                Back
              </Button>
              <Button onClick={handleExport} className="flex-1">
                <DownloadSimple className="w-4 h-4 mr-2" />
                Download Backup
              </Button>
            </div>
          </div>
        )}

        {/* Import View */}
        {mode === 'import' && (
          <div className="space-y-4 py-4">
            {/* File Selection */}
            {importStep === 'select' && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-8 rounded-lg border-2 border-dashed hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <FileArrowUp className="w-10 h-10" />
                    <p className="font-medium">Click to select backup file</p>
                    <p className="text-xs">or drag and drop a .json file</p>
                  </div>
                </button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setMode('menu')} className="flex-1">
                    Back
                  </Button>
                </div>
              </>
            )}

            {/* Preview */}
            {importStep === 'preview' && importData && (
              <>
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-400 mb-2">
                    <CheckCircle className="w-5 h-5" weight="fill" />
                    <span className="font-medium">Valid backup file</span>
                  </div>
                  {selectedFile && (
                    <p className="text-xs text-muted-foreground">
                      {selectedFile.name} ({formatFileSize(selectedFile.size)})
                    </p>
                  )}
                </div>

                {importWarnings.length > 0 && (
                  <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                    <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 mb-1">
                      <Warning className="w-4 h-4" />
                      <span className="text-sm font-medium">Warnings</span>
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {importWarnings.map((w, i) => (
                        <li key={i}>• {w}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                  <p className="text-sm font-medium">This backup contains:</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>{importData.members.length} members</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ListChecks className="w-4 h-4 text-muted-foreground" />
                      <span>{importData.chores.length} chores</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarBlank className="w-4 h-4 text-muted-foreground" />
                      <span>{importData.events.length} events</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-muted-foreground" />
                      <span>
                        {importData.monthlyCompetitions.length + importData.weeklyCompetitions.length} competitions
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-xs text-destructive font-medium">
                    ⚠️ Warning: This will replace ALL your current data!
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setImportStep('select')
                      setImportData(null)
                      setSelectedFile(null)
                    }}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button onClick={handleImportConfirm} variant="destructive" className="flex-1">
                    <UploadSimple className="w-4 h-4 mr-2" />
                    Replace Data
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
