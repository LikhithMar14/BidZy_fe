import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Users, Video, Mic, MicOff, VideoOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface Participant {
  id: string;
  name: string;
  isActive: boolean;
  hasVideo: boolean;
  hasAudio: boolean;
  isSpeaking?: boolean;
}

interface ParticipantsListProps {
  participants: Participant[];
  maxDisplayed?: number;
  currentUserId?: string;
}

export default function ParticipantsList({ 
  participants, 
  maxDisplayed = 5,
  currentUserId 
}: ParticipantsListProps) {
  // Sort participants: current user first, then active participants, then inactive
  const sortedParticipants = [...participants].sort((a, b) => {
    // Current user always first
    if (a.id === currentUserId) return -1;
    if (b.id === currentUserId) return 1;
    
    // Then active participants
    if (a.isActive && !b.isActive) return -1;
    if (!a.isActive && b.isActive) return 1;
    
    // Then speaking participants
    if (a.isSpeaking && !b.isSpeaking) return -1;
    if (!a.isSpeaking && b.isSpeaking) return 1;
    
    // Alphabetical by name
    return a.name.localeCompare(b.name);
  });

  const displayedParticipants = sortedParticipants.slice(0, maxDisplayed);
  const remainingCount = sortedParticipants.length - maxDisplayed;

  if (participants.length === 0) {
    return (
      <Card className="p-4 text-center bg-gray-50">
        <Users className="w-6 h-6 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600 text-sm">No participants yet</p>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-700 flex items-center">
          <Users className="w-4 h-4 mr-2" />
          Participants
        </h3>
        <Badge variant="outline" className="text-xs">
          {participants.length}
        </Badge>
      </div>

      <AnimatePresence>
        {displayedParticipants.map((participant) => (
          <motion.div
            key={participant.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`flex items-center justify-between p-2 rounded-lg ${
              participant.isActive 
                ? participant.isSpeaking 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-blue-50 border border-blue-100'
                : 'bg-gray-50 border border-gray-100'
            } ${participant.id === currentUserId ? 'ring-2 ring-blue-300' : ''}`}
          >
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                participant.isActive 
                  ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {participant.id === currentUserId ? (
                  <User className="w-4 h-4" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium">
                  {participant.name}
                  {participant.id === currentUserId && " (You)"}
                </p>
                {participant.isSpeaking && (
                  <p className="text-xs text-green-600">Speaking...</p>
                )}
              </div>
            </div>
            
            <div className="flex space-x-1">
              {participant.hasAudio ? (
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <Mic className="w-3 h-3 text-green-600" />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                  <MicOff className="w-3 h-3 text-gray-400" />
                </div>
              )}
              
              {participant.hasVideo ? (
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <Video className="w-3 h-3 text-green-600" />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                  <VideoOff className="w-3 h-3 text-gray-400" />
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {remainingCount > 0 && (
        <div className="text-center py-2 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-xs text-gray-500">
            +{remainingCount} more participant{remainingCount !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
} 