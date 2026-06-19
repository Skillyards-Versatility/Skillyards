"use client";

import { useState, useMemo } from "react";
import { 
  Search, Phone, PhoneCall, PhoneMissed, Play, Pause, Volume2, Clock, Calendar, User, FileAudio
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format";
import { API } from "@/lib/api";

export function CallsClient({ initialCalls }) {
  const [calls] = useState(initialCalls);
  const [searchInput, setSearchInput] = useState("");
  const [outcomeFilter, setOutcomeFilter] = useState("");
  const [activeCall, setActiveCall] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");

  const filteredCalls = useMemo(() => {
    return calls.filter((call) => {
      const matchesSearch = 
        call.leadPhone.includes(searchInput) ||
        call.telecallerName.toLowerCase().includes(searchInput.toLowerCase());
      
      const matchesOutcome = outcomeFilter === "" || call.outcome === outcomeFilter;

      return matchesSearch && matchesOutcome;
    });
  }, [calls, searchInput, outcomeFilter]);

  const handlePlayCall = (call) => {
    if (!call.recordingUrl) return;
    
    const playUrl = `${API}/api/telephony/playback?key=${call.recordingUrl}`;
    
    if (activeCall?.id === call.id) {
      const audioElement = document.getElementById("global-audio-player");
      if (audioElement) {
        if (isPlaying) {
          audioElement.pause();
          setIsPlaying(false);
        } else {
          audioElement.play().catch(console.error);
          setIsPlaying(true);
        }
      }
    } else {
      setActiveCall(call);
      setAudioUrl(playUrl);
      setIsPlaying(true);
      
      setTimeout(() => {
        const audioElement = document.getElementById("global-audio-player");
        if (audioElement) {
          audioElement.load();
          audioElement.play().catch(console.error);
        }
      }, 50);
    }
  };

  const formatDuration = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatPhoneNumber = (phone) => {
    if (phone.length === 10) {
      return `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;
    }
    return phone;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Call Tracker Logs</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track, audit, and listen to outbound sales calls recorded by the mobile app.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground">
          <FileAudio className="h-4 w-4 text-primary" />
          {filteredCalls.length} logs
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by caller or phone..."
            className="input pl-10 pr-4 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={outcomeFilter}
            onChange={(e) => setOutcomeFilter(e.target.value)}
            className="input w-auto text-sm py-2 pr-8"
          >
            <option value="">All outcomes</option>
            <option value="reached">Reached (&gt;15s)</option>
            <option value="not_reached">Not Reached (&le;15s)</option>
          </select>
        </div>
      </div>

      {/* Table Card */}
      <div className="card overflow-hidden">
        {filteredCalls.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <PhoneCall className="mb-4 h-10 w-10 text-muted-foreground/40 animate-bounce" />
            <h2 className="text-base font-semibold text-foreground">No call logs found</h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              {searchInput || outcomeFilter
                ? "No call logs match your filter criteria. Try adjusting your search."
                : "Outbound call logs from the Android tele-calling app will appear here."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="border-b border-border bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-semibold">Telecaller</th>
                  <th className="px-5 py-3 font-semibold">Dialed Number</th>
                  <th className="px-5 py-3 font-semibold">Duration</th>
                  <th className="px-5 py-3 font-semibold">Outcome</th>
                  <th className="px-5 py-3 font-semibold">Time</th>
                  <th className="px-5 py-3 font-semibold text-right">Recording</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCalls.map((call) => {
                  const isCallActive = activeCall?.id === call.id;
                  const hasRecording = !!call.recordingUrl;
                  
                  return (
                    <tr
                      key={call.id}
                      className={cn(
                        "align-middle transition-colors",
                        isCallActive ? "bg-primary/[0.04]" : "hover:bg-muted/30"
                      )}
                    >
                      {/* Telecaller */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <span className="font-semibold text-foreground">{call.telecallerName}</span>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="px-5 py-4 font-medium text-foreground">
                        <div className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                          {formatPhoneNumber(call.leadPhone)}
                        </div>
                      </td>

                      {/* Duration */}
                      <td className="px-5 py-4 text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground/60" />
                          {formatDuration(call.duration)}
                        </div>
                      </td>

                      {/* Outcome */}
                      <td className="px-5 py-4">
                        {call.outcome === "reached" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                            <PhoneCall className="h-3 w-3 animate-pulse" />
                            Reached
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700 border border-rose-200">
                            <PhoneMissed className="h-3 w-3" />
                            Not Reached
                          </span>
                        )}
                      </td>

                      {/* Contacted At */}
                      <td className="px-5 py-4 text-muted-foreground whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground/60" />
                          <div>
                            <div>{formatDate(call.contactedAt)}</div>
                            <div className="text-xs">
                              {new Date(call.contactedAt).toLocaleTimeString("en-IN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        {hasRecording ? (
                          <button
                            onClick={() => handlePlayCall(call)}
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold shadow-sm transition-all cursor-pointer",
                              isCallActive && isPlaying
                                ? "bg-primary text-primary-foreground"
                                : "bg-card text-foreground hover:bg-muted border border-border"
                            )}
                          >
                            {isCallActive && isPlaying ? (
                              <>
                                <Pause className="h-3.5 w-3.5 fill-current" />
                                Playing
                              </>
                            ) : (
                              <>
                                <Play className="h-3.5 w-3.5 fill-current" />
                                Listen
                              </>
                            )}
                          </button>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">No Audio</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Floating Global Audio Player */}
      {activeCall && (
        <div className="fixed bottom-4 right-4 left-4 lg:left-72 z-50 bg-card border border-border rounded-xl shadow-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary animate-pulse">
              <Volume2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Playing Recording</p>
              <h4 className="text-sm font-bold text-foreground">
                {formatPhoneNumber(activeCall.leadPhone)} &bull; {activeCall.telecallerName}
              </h4>
            </div>
          </div>

          <div className="w-full md:flex-1 md:max-w-xl">
            <audio
              id="global-audio-player"
              src={audioUrl}
              controls
              className="w-full h-9 rounded-lg"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
            />
          </div>

          <button
            onClick={() => {
              const audioElement = document.getElementById("global-audio-player");
              if (audioElement) audioElement.pause();
              setActiveCall(null);
              setIsPlaying(false);
            }}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer px-3 py-1.5 rounded-md hover:bg-muted transition-all"
          >
            Close Player
          </button>
        </div>
      )}
    </div>
  );
}
