package com.inha.everytown.domain.board.controller;

import com.inha.everytown.domain.board.dto.*;
import com.inha.everytown.domain.board.service.BoardService;
import com.inha.everytown.domain.board.service.CommentService;
import com.inha.everytown.domain.board.service.LikeService;
import com.inha.everytown.global.jwt.PrincipalDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/boards")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;
    private final CommentService commentService;
    private final LikeService likeService;

    // 근처 1km 반경의 글 가져오기
    @GetMapping
    public ResponseEntity<Page<BoardResDto>> getBoardList(@RequestParam int page,
                                                          @RequestParam(required = false) Long category,
                                                          @RequestParam double lat,
                                                          @RequestParam double lon) {

        Page<BoardResDto> boardList = boardService.getBoardList(category, lat, lon, page);
        return ResponseEntity.ok(boardList);
    }

    // 게시글 불러오기 -> 조회했으니 조회수 증가 로직 수행
    @GetMapping("/{boardId}")
    public ResponseEntity<BoardResDto> getBoardDetail(@PathVariable Long boardId) {

        BoardResDto board = boardService.viewBoard(boardId);
        return ResponseEntity.ok(board);
    }

    // 게시글에 달린 댓글 가져오기
    @GetMapping("/{boardId}/comment")
    public ResponseEntity<Page<CommentResDto>> getBoardCommentList(@PathVariable Long boardId,
                                                                   @RequestParam int page) {

        Page<CommentResDto> commentPage = commentService.getCommentPage(boardId, page);
        return ResponseEntity.ok(commentPage);
    }

    // 게시글 작성
    @PostMapping
    public ResponseEntity<BoardResDto> saveBoard(@AuthenticationPrincipal PrincipalDetails principalDetails,
                                                 @RequestBody BoardSaveReqDto reqDto,
                                                 @RequestParam double lat,
                                                 @RequestParam double lon) {

        Long memberId = principalDetails.getMember().getId();
        BoardResDto savedBoard = boardService.saveBoard(memberId, reqDto, lat, lon);
        return ResponseEntity.ok(savedBoard);
    }

    // 게시글 수정
    @PostMapping("/{boardId}")
    public ResponseEntity<BoardResDto> updateBoard(@AuthenticationPrincipal PrincipalDetails principalDetails,
                                                   @PathVariable Long boardId,
                                                   @RequestBody BoardUpdateReqDto reqDto) {

        Long memberId = principalDetails.getMember().getId();
        BoardResDto updatedBoard = boardService.updateBoard(memberId, boardId, reqDto);
        return ResponseEntity.ok(updatedBoard);
    }

    // 게시글 삭제
    @DeleteMapping("/{boardId}")
    public ResponseEntity<Void> deleteBoard(@AuthenticationPrincipal PrincipalDetails principalDetails,
                                            @PathVariable Long boardId) {

        // 수정의 검증로직은 서비스 단에서 하지만 삭제는 할게 좀 많아서 검증을 여기서 함
        Long memberId = principalDetails.getMember().getId();
        if (boardService.isWriter(memberId, boardId)) {
            likeService.deleteLikeRelatedBoard(boardId);
            commentService.deleteCommentRelatedBoard(boardId);
            boardService.deleteBoard(boardId);
        }
        return ResponseEntity.ok().build();
    }

    // 댓글 달기
    @PostMapping("/{boardId}/comment")
    public ResponseEntity<Page<CommentResDto>> saveComment(@AuthenticationPrincipal PrincipalDetails principalDetails,
                                                           @PathVariable Long boardId,
                                                           @RequestBody CommentReqDto reqDto,
                                                           @RequestParam(defaultValue = "0") int page) {

        Long memberId = principalDetails.getMember().getId();
        commentService.saveComment(memberId, boardId, reqDto);
        Page<CommentResDto> commentPage = commentService.getCommentPage(boardId, page);
        return ResponseEntity.ok(commentPage);
    }

    // 댓글 수정
    @PostMapping("/{boardId}/comment/{commentId}")
    public ResponseEntity<Page<CommentResDto>> updateComment(@AuthenticationPrincipal PrincipalDetails principalDetails,
                                                             @PathVariable Long boardId,
                                                             @PathVariable Long commentId,
                                                             @RequestBody CommentReqDto reqDto,
                                                             @RequestParam(defaultValue = "0") int page) {

        Long memberId = principalDetails.getMember().getId();
        commentService.updateComment(memberId, commentId, reqDto);
        Page<CommentResDto> commentPage = commentService.getCommentPage(boardId, page);
        return ResponseEntity.ok(commentPage);
    }

    // 댓글 삭제
    @DeleteMapping("/{boardId}/comment/{commentId}")
    public ResponseEntity<Page<CommentResDto>> deleteComment(@AuthenticationPrincipal PrincipalDetails principalDetails,
                                                             @PathVariable Long boardId,
                                                             @PathVariable Long commentId,
                                                             @RequestParam(defaultValue = "0") int page) {

        Long memberId = principalDetails.getMember().getId();
        commentService.deleteComment(memberId, boardId, commentId);
        Page<CommentResDto> commentPage = commentService.getCommentPage(boardId, page);
        return ResponseEntity.ok(commentPage);
    }

    // 좋아요 했는지 return
    @GetMapping("/{boardId}/like")
    public ResponseEntity<Boolean> didMemberLike(@AuthenticationPrincipal PrincipalDetails principalDetails,
                                                 @PathVariable Long boardId) {

        Long memberId = principalDetails.getMember().getId();
        Boolean value = likeService.didMemberLike(memberId, boardId);
        return ResponseEntity.ok(value);
    }

    // 좋아요 증가
    @PostMapping("/{boardId}/like")
    public ResponseEntity<Long> likeBoard(@AuthenticationPrincipal PrincipalDetails principalDetails,
                                          @PathVariable Long boardId) {

        Long memberId = principalDetails.getMember().getId();
        Long likeCnt = likeService.doLike(memberId, boardId);
        return ResponseEntity.ok(likeCnt);
    }

    @DeleteMapping("/{boardId}/like")
    public ResponseEntity<Long> cancelLike(@AuthenticationPrincipal PrincipalDetails principalDetails,
                                           @PathVariable Long boardId) {

        Long memberId = principalDetails.getMember().getId();
        Long likeCnt = likeService.cancelLike(memberId, boardId);
        return ResponseEntity.ok(likeCnt);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<BoardSearchResDto>> search(@RequestParam String query,
                                                          @RequestParam int page,
                                                          @RequestParam(required = false) Long category,
                                                          @RequestParam double lat,
                                                          @RequestParam double lon) {

        Page<BoardSearchResDto> search = boardService.search(query, category, page, lat, lon);
        return ResponseEntity.ok(search);
    }
}