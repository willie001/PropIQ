"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import PropertyList, { Property } from "./PropertyList";
import AddPropertyForm, { PropertyFormValues } from "./AddPropertyForm";

type LoadState = "loading" | "error" | "success";

export default function PropertyListContainer() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [state, setState] = useState<LoadState>("loading");

  async function loadProperties() {
    setState("loading");

    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("is_archived", false);

    if (error) {
      console.error("Error loading properties", error);
      setState("error");
      return;
    }

    const mapped: Property[] =
      (data ?? []).map((row: any) => ({
        id: row.id,
        name: row.name,
        suburb: row.suburb ?? "",
        status: row.status as "occupied" | "vacant",
      })) ?? [];

    setProperties(mapped);
    setState("success");
  }

  useEffect(() => {
    loadProperties();
  }, []);

  async function handleAddProperty(values: PropertyFormValues) {
    // For now, we don't use owner_id and street/state etc.
    const { error } = await supabase.from("properties").insert({
      name: values.name,
      street: values.name, // quick & dirty until we split fields later
      suburb: values.suburb,
      state: "WA",
      postcode: null,
      status: values.status,
      is_archived: false,
    });

    if (error) {
      console.error("Error inserting property", error);
      throw error; // Let the form show its generic error message
    }

    // Reload list after successful insert
    await loadProperties();
  }

  async function handleArchiveProperty(id: string) {
    const { error } = await supabase
      .from("properties")
      .update({ is_archived: true })
      .eq("id", id);

    if (error) {
      console.error("Error archiving property", error);
      // For now, just log; later we can show a toast/error to the user
      return;
    }

    await loadProperties();
  }

  if (state === "loading") {
    return (
      <div className="space-y-4">
        <AddPropertyForm onAdd={handleAddProperty} />
        <section className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 md:p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2 text-slate-100">
            Your properties
          </h2>
          <p className="text-sm text-slate-400">Loading properties…</p>
        </section>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="space-y-4">
        <AddPropertyForm onAdd={handleAddProperty} />
        <section className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 md:p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-2 text-slate-100">
            Your properties
          </h2>
          <p className="text-sm text-red-400">
            Could not load properties. Please try again.
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AddPropertyForm onAdd={handleAddProperty} />
      <PropertyList
        properties={properties}
        onArchive={handleArchiveProperty}
      />
    </div>
  );
}
