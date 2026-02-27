"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Users,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Crown,
  FileText,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

export default function MyTeams() {
  const router = useRouter();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchMyTeams();
  }, []);

  const fetchMyTeams = async () => {
    try {
      const res = await fetch("/api/teams?my=true");
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        throw new Error("Failed to fetch teams");
      }
      const data = await res.json();
      setTeams(data.teams || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (teamId) => {
    setDeletingId(teamId);
    try {
      const res = await fetch(`/api/teams/${teamId}`, {
        method: "DELETE",
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete team");
      }
      
      // Remove from list
      setTeams(teams.filter(t => t._id !== teamId));
      setShowDeleteConfirm(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "TE";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#950E1D]" />
          <span className="text-slate-600">Loading your teams...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/u/dashboard"
            className="inline-flex items-center text-sm text-slate-500 hover:text-[#950E1D] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#1B263B]">My Teams</h1>
              <p className="text-slate-500 mt-1">
                Manage your research teams and collaborations
              </p>
            </div>
            <Link
              href="/u/create-team"
              className="inline-flex items-center px-4 py-2 bg-[#950E1D] text-white rounded-lg hover:bg-[#7a0c18] transition-colors font-medium"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Team
            </Link>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Teams Grid */}
        {teams.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-[#1B263B] mb-2">
              No teams yet
            </h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              You haven&apos;t created any research teams yet. Create your first team to start collaborating with other researchers.
            </p>
            <Link
              href="/u/create-team"
              className="inline-flex items-center px-6 py-3 bg-[#950E1D] text-white rounded-xl hover:bg-[#7a0c18] transition-colors font-medium"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Team
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <div
                key={team._id}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                {/* Card Header */}
                <div className="h-2 bg-gradient-to-r from-[#950E1D] to-[#B01124]" />
                
                <div className="p-6">
                  {/* Team Info */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative flex-shrink-0">
                      {team.profilePicture ? (
                        <Image
                          src={team.profilePicture}
                          alt={team.teamName}
                          width={64}
                          height={64}
                          className="rounded-xl object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#950E1D] to-[#B01124] flex items-center justify-center text-white font-bold text-xl">
                          {getInitials(team.teamName)}
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 bg-amber-100 p-1 rounded-lg">
                        <Crown className="w-4 h-4 text-amber-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[#1B263B] text-lg truncate">
                        {team.teamName}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {team.fieldOfResearch || "No research field set"}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#950E1D]/10 text-[#950E1D]">
                          Owner
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-600">
                        {team.members?.length || 0} members
                      </span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-600">
                        {team.papers?.length || 0} papers
                      </span>
                    </div>
                  </div>

                  {/* Moto */}
                  {team.moto && (
                    <p className="text-sm text-slate-500 italic mb-4 line-clamp-2">
                      &ldquo;{team.moto}&rdquo;
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-slate-100">
                    <Link
                      href={`/teams/${team._id}`}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View
                    </Link>
                    <Link
                      href={`/u/teams/${team._id}/edit`}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-[#950E1D]/10 text-[#950E1D] rounded-lg hover:bg-[#950E1D]/20 transition-colors text-sm font-medium"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Link>
                    <button
                      onClick={() => setShowDeleteConfirm(team._id)}
                      disabled={deletingId === team._id}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      {deletingId === team._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-red-100 rounded-xl">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-[#1B263B]">
                  Delete Team?
                </h3>
              </div>
              <p className="text-slate-600 mb-6">
                Are you sure you want to delete this team? This action cannot be undone. All team data, including members and publications, will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  disabled={deletingId === showDeleteConfirm}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                >
                  {deletingId === showDeleteConfirm ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting...
                    </span>
                  ) : (
                    "Delete Team"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
