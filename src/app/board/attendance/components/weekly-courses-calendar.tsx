"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useClassSessionsByWeekQuery, useEmargementMutation } from "@/hooks/queries/use-attendance.query";
import { ClassSession } from "@/types/attendance.types";
import { RiArrowLeftSLine, RiArrowRightSLine, RiCalendarCheckLine, RiMapPinLine, RiTimeLine } from "@remixicon/react";
import { addDays, addWeeks, format, isSameDay, parseISO, startOfWeek, subWeeks } from "date-fns";
import { fr } from "date-fns/locale";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export function WeeklyCoursesCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSession, setSelectedSession] = useState<ClassSession | null>(null);
  const [comments, setComments] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const startDate = startOfWeek(currentDate, { locale: fr });

  // Récupérer les sessions de cours pour la semaine courante
  const { data: weekSessions, isLoading, refetch } = useClassSessionsByWeekQuery(startDate);

  // Mutation pour l'émargement
  const { mutate: submitEmargement, isPending } = useEmargementMutation();

  // Générer les jours de la semaine
  const weekDays = useMemo(() => {
    const days = [];
    const start = startOfWeek(currentDate, { locale: fr });

    for (let i = 0; i < 7; i++) {
      days.push(addDays(start, i));
    }

    return days;
  }, [currentDate]);

  // Gérer la navigation entre les semaines
  const goToPreviousWeek = () => setCurrentDate(subWeeks(currentDate, 1));
  const goToNextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
  const goToCurrentWeek = () => setCurrentDate(new Date());

  // Ouvrir le dialogue d'émargement pour une session spécifique
  const openEmargementDialog = (session: ClassSession) => {
    setSelectedSession(session);
    setComments("");
    setDialogOpen(true);
  };

  // Soumettre l'émargement
  const handleSubmitEmargement = () => {
    if (!selectedSession) return;

    submitEmargement(
      {
        classSessionId: selectedSession.id,
        comments: comments.trim() || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Émargement effectué avec succès");
          setDialogOpen(false);
          refetch();
        },
        onError: (error) => {
          toast.error("Erreur lors de l'émargement du cours");
          console.error("Erreur émargement:", error);
        },
      }
    );
  };

  // Vérifier si une session a déjà été émargée
  const isSessionSigned = (session: ClassSession) => {
    return !!session.emargement;
  };

  // Formater l'horaire pour un affichage plus compact
  const formatTimeRange = (start: string, end: string) => {
    return `${format(parseISO(start), "HH:mm")} - ${format(parseISO(end), "HH:mm")}`;
  };

  // Récupérer les sessions d'un jour spécifique
  const getSessionsByDay = (day: Date) => {
    if (!weekSessions) return [];
    return weekSessions.filter((session) => isSameDay(parseISO(session.date), day));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Chargement du calendrier...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Navigation du calendrier */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={goToPreviousWeek}>
            <RiArrowLeftSLine className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToCurrentWeek}>
            Aujourd'hui
          </Button>
          <Button variant="outline" size="icon" onClick={goToNextWeek}>
            <RiArrowRightSLine className="h-4 w-4" />
          </Button>
        </div>
        <h2 className="text-lg font-semibold">Semaine du {format(startDate, "d MMMM yyyy", { locale: fr })}</h2>
      </div>

      {/* Grille du calendrier */}
      <div className="grid grid-cols-7 gap-2">
        {/* En-têtes des jours */}
        {weekDays.map((day) => (
          <div
            key={day.toString()}
            className={`p-2 text-center border-b ${isSameDay(day, new Date()) ? "bg-muted font-semibold rounded-t-md" : ""}`}
          >
            <div className="font-medium">{format(day, "EEE", { locale: fr })}</div>
            <div className="text-sm">{format(day, "d MMM", { locale: fr })}</div>
          </div>
        ))}

        {/* Contenu des jours */}
        {weekDays.map((day) => {
          const daySessions = getSessionsByDay(day);

          return (
            <div
              key={`content-${day.toString()}`}
              className={`min-h-[150px] p-1 border ${isSameDay(day, new Date()) ? "bg-muted/50 rounded-b-md" : ""}`}
            >
              {daySessions.length === 0 ? (
                <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                  <p>Pas de cours</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {daySessions.map((session) => (
                    <Card
                      key={session.id}
                      className={`text-xs p-0 shadow-sm hover:shadow-md transition-shadow ${
                        isSessionSigned(session) ? "border-green-500/50 bg-green-50 dark:bg-green-950/20" : "cursor-pointer"
                      }`}
                      onClick={() => !isSessionSigned(session) && openEmargementDialog(session)}
                    >
                      <CardHeader className="p-2 pb-0">
                        <CardTitle className="text-xs font-medium">{session.course?.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-2 space-y-1">
                        <div className="flex items-center">
                          <RiTimeLine className="mr-1 w-3 h-3 text-muted-foreground" />
                          <span>{formatTimeRange(session.heureDebut, session.heureFin)}</span>
                        </div>
                        {session.course?.location && (
                          <div className="flex items-center">
                            <RiMapPinLine className="mr-1 w-3 h-3 text-muted-foreground" />
                            <span>{session.course.location}</span>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="p-2 pt-0 flex justify-between items-center">
                        {isSessionSigned(session) ? (
                          <span className="text-green-600 font-medium text-[10px] flex items-center">
                            <RiCalendarCheckLine className="mr-1" />
                            Émargé
                          </span>
                        ) : (
                          <Button variant="ghost" size="sm" className="h-5 text-[10px]">
                            Émarger
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Dialogue d'émargement */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Émarger votre cours</DialogTitle>
            <DialogDescription>Confirmez votre présence au cours ci-dessous</DialogDescription>
          </DialogHeader>

          {selectedSession && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-1">Cours</h3>
                  <p>{selectedSession.course?.title}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Date</h3>
                  <p>{format(parseISO(selectedSession.date), "EEEE d MMMM yyyy", { locale: fr })}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Horaire</h3>
                  <p>
                    {format(parseISO(selectedSession.heureDebut), "HH:mm", { locale: fr })} -
                    {format(parseISO(selectedSession.heureFin), "HH:mm", { locale: fr })}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Lieu</h3>
                  <p>{selectedSession.course?.location || "Non spécifié"}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Commentaires (optionnel)</h3>
                <Textarea
                  placeholder="Ajoutez vos commentaires sur le cours..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={isPending}>
              Annuler
            </Button>
            <Button variant="default" onClick={handleSubmitEmargement} disabled={isPending}>
              <RiCalendarCheckLine className="mr-2" />
              Émarger ce cours
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
