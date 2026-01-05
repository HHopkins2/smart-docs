import { NextRequest, NextResponse } from 'next/server';
import { getServices } from '@/server/services';
import * as path from 'path';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filePath = searchParams.get('path');

    if (!filePath) {
      return NextResponse.json(
        { error: 'Missing path parameter' },
        { status: 400 }
      );
    }

    const { markdownService, config } = getServices();
    const absolutePath = path.join(config.docsPath, filePath);

    // Security check: ensure path is within docs directory
    if (!absolutePath.startsWith(config.docsPath)) {
      return NextResponse.json(
        { error: 'Invalid path' },
        { status: 403 }
      );
    }

    const content = await markdownService.readMarkdownFile(absolutePath);

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error reading markdown file:', error);
    return NextResponse.json(
      { error: 'Failed to read file' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filePath = searchParams.get('path');

    if (!filePath) {
      return NextResponse.json(
        { error: 'Missing path parameter' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { content, frontmatter } = body;

    if (typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid content' },
        { status: 400 }
      );
    }

    const { markdownService, config } = getServices();
    const absolutePath = path.join(config.docsPath, filePath);

    // Security check: ensure path is within docs directory
    if (!absolutePath.startsWith(config.docsPath)) {
      return NextResponse.json(
        { error: 'Invalid path' },
        { status: 403 }
      );
    }

    await markdownService.writeMarkdownFile(absolutePath, {
      content,
      frontmatter: frontmatter || null,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error writing markdown file:', error);
    return NextResponse.json(
      { error: 'Failed to write file' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path: filePath, content, frontmatter } = body;

    if (!filePath || typeof filePath !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid path' },
        { status: 400 }
      );
    }

    if (typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid content' },
        { status: 400 }
      );
    }

    const { markdownService, config } = getServices();

    await markdownService.createFile(config.docsPath, filePath, {
      content,
      frontmatter: frontmatter || null,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error creating file:', error);

    if (error.message === 'File already exists') {
      return NextResponse.json(
        { error: 'File already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create file' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filePath = searchParams.get('path');

    if (!filePath) {
      return NextResponse.json(
        { error: 'Missing path parameter' },
        { status: 400 }
      );
    }

    const { markdownService, config } = getServices();

    await markdownService.deleteFile(config.docsPath, filePath);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}
