import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseServer";

export async function GET() {
  const { data, error } = await supabase.from("clubMembers").select("*").eq("year", "2025-26");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ teams: data });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { name, role, image } = body;
  console.log(body);
  const { data, error } = await supabase.from("clubMembers").insert([body]);
  if (error) {
    console.log(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  };

  return NextResponse.json({ message: "Team member added", data }, { status: 201 });
}

export async function PUT(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const body = await req.json();

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const { data, error } = await supabase.from("clubMembers").update(body).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ message: "Team member updated", data });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const { data, error } = await supabase.from("clubMembers").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ message: "Team member deleted", data });
}
